var fs = require('fs');
var jsonFile = './abis/pot.json';
var potAbi = JSON.parse(fs.readFileSync(jsonFile));
var Tx = require('ethereumjs-tx').Transaction
var colors = require('colors');
var mysql = require('mysql');
var Common = require('ethereumjs-common').default;

var BSC_FORK = Common.forCustomChain(
    'mainnet',
    {
        name: 'Binance Smart Chain Mainnet',
        networkId: 56,
        chainId: 56,
        url: 'https://bsc-dataseed.binance.org/'
    },
    'istanbul',
);

var BNBTEST_NET = Common.forCustomChain(
    'ropsten',
    {
        name: 'Binance Smart Chain Testnet',
        networkId: 97,
        chainId: 97,
        url: 'https://data-seed-prebsc-1-s1.binance.org:8545'
    },
    'istanbul',
);

require('dotenv').config();

const date = require('date-and-time')
const Web3 = require('web3')
const RPC_PROVIDER = process.env.RPC_PROVIDER
const web3 = new Web3(RPC_PROVIDER)
const POT_ADDRESS = process.env.POT_CONTRACT_ADDRESS
const ADMIN_PRIVATE = Buffer.from(process.env.PRIVATE_KEY, 'hex')
const ADMIN_ADDRESS = process.env.PUBLIC_ADDRESS
const GAS = process.env.ENTER_MAX_GAS
const CHAIN = process.env.CHAIN
const TOKEN_NAME_COLUMN = process.env.TOKEN_NAME_COLUMN
const TOKEN_AMOUNT_COLUMN = process.env.TOKEN_AMOUNT_COLUMN
const TOKEN_ENTERED_COLUMN = process.env.TOKEN_ENTERED_COLUMN
const SENDER_ADDRESS_COLUMN = process.env.SENDER_ADDRESS_COLUMN
const TOKEN_TX_COLUMN = process.env.TOKEN_TX_COLUMN
const TOKENS_TRANSFERS_INFO_TABLE = process.env.TOKENS_TRANSFERS_INFO_TABLE
const AVG_BLOCK_TIME = process.env.AVG_BLOCK_TIME
const ERROR_FILE = process.env.ENTER_POT_ERROR_FILE

var connection, checkingIfEntry = false, error_count = 0, gasPrice
var potContract = new web3.eth.Contract(potAbi, POT_ADDRESS)

function handleDisconnect() {
    connection = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
        connectionLimit: process.env.MYSQL_MAX_CONNECTION,
        debug: false
    });
}

function EnterPot(tokens, amounts, addresses) {
    if (tokens.length == 0) {
        return
    }
    setTimeout(() => {
        console.log(colors.blue("Attempting to enter pot"))
        web3.eth.getTransactionCount(ADMIN_ADDRESS, async (err, txCount) => {
            if (!err) {
                try {

                    const _gasPrice = await web3.eth.getGasPrice()
                    let txObject = {
                        nonce: web3.utils.toHex(txCount),
                        gasLimit: web3.utils.toHex(parseInt(GAS)), // Raise the gas limit to a much higher amount
                        gasPrice: web3.utils.toHex(parseInt(_gasPrice * 1.2)),
                        to: POT_ADDRESS,
                        data: potContract.methods.EnterPot(tokens, amounts, addresses).encodeABI()
                    }
                    const tx = new Tx(txObject, { 'common': BNBTEST_NET })
                    tx.sign(ADMIN_PRIVATE)
                    const serializedTx = tx.serialize()
                    const raw = '0x' + serializedTx.toString('hex')
                    web3.eth.sendSignedTransaction(raw).on('error', function (err) {
                        logError("ERROR SENDING SIGNED TRANSACTION", err)
                    }).on('transactionHash', function (txHash) {
                        console.log(colors.green("success: ", txHash))
                    });

                } catch (error) {
                    console.log(error)
                    logError("There was an error sending transaction", error)
                }
            } else {
                logError("There was an error getting transaction count", err)
            }

        })
    }, AVG_BLOCK_TIME);
}

async function setGasPrice() {
    const _gasPrice = await web3.eth.getGasPrice()
    gasPrice = _gasPrice
}

function checkIfEntry() {
    try {
        if (checkingIfEntry === true) {
            return
        } else {
            checkingIfEntry = true
            var sql = "SELECT * FROM `" + TOKENS_TRANSFERS_INFO_TABLE + "` WHERE `" + TOKEN_ENTERED_COLUMN + "` = '0' LIMIT 5;"
            connection.getConnection(function (err, _connection) {
                try {
                    if (err) {
                        try {
                            _connection.release();
                        } catch (error) {
                        }
                        logError(sql, err)
                        checkingIfEntry = false
                        return
                    } else {
                        _connection.query(sql, function (err, sqlresult, fields) {
                            try {
                                _connection.release();
                            } catch (error) {
                            }
                            if (err) {
                                checkingIfEntry = false
                                logError(sql, err)
                                return
                            } else {
                                if (sqlresult.length > 0) {
                                    console.log(colors.blue("saw some.."))
                                    var tokens = [], amounts = [], addresses = [], txhash = []
                                    for (let index = 0; index < sqlresult.length; index++) {
                                        tokens.push((sqlresult[index][process.env.TOKEN_NAME_COLUMN].toString()))
                                        amounts.push((sqlresult[index][process.env.TOKEN_AMOUNT_COLUMN].toString()))
                                        addresses.push((sqlresult[index][process.env.SENDER_ADDRESS_COLUMN].toString()))
                                        txhash.push((sqlresult[index][process.env.TOKEN_TX_COLUMN].toString()))
                                    }
                                    updateEntry(tokens, amounts, addresses, txhash)
                                } else {
                                    checkingIfEntry = false
                                }
                            }
                        });
                    }
                } catch (error) {
                    logError("Error in checkIfEntry")
                    try {
                        _connection.release();
                    } catch (error) {
                    }
                }

            });
        }
    } catch (error) {
        logError("Error in checkIfEntry")
    }
}

function updateEntry(tokens, amounts, addresses, txHash) {
    try {
        if (tokens.length == 0) {
            return
        }
        var sql = "UPDATE `" + TOKENS_TRANSFERS_INFO_TABLE + "`  SET `" + TOKEN_ENTERED_COLUMN + "` = " + "1" + " WHERE ";
        connection.getConnection(function (err, _connection) {
            try {
                if (err) {
                    logError("Error while getting ", error)
                    try {
                        _connection.release();
                    } catch (error) {
                    }
                    checkingIfEntry = false
                    logError(sql, err)
                    return
                } else {
                    var WHERE = ""
                    for (let index = 0; index < txHash.length; index++) {
                        WHERE += " `" + TOKEN_TX_COLUMN + "` LIKE '" + txHash[index] + "' " + (index + 1 < txHash.length ? " OR " : " ")
                    }
                    WHERE += " ;"
                    sql += WHERE;
                    _connection.query(sql, function (err, sqlresult) {
                        try {
                            _connection.release();
                        } catch (error) {
                        }
                        if (err) {
                            logError(sql, err)
                            return
                        } else {
                            EnterPot(tokens, amounts, addresses, txHash)
                        }
                        checkingIfEntry = false
                    });
                }
            } catch (error) {
                try {
                    _connection.release();
                } catch (error) {
                }
            }

        });
    } catch (error) {
        logError("Error while inside updateEntry", error)
    }

}

function logError(info, error) {
    var path = require('path');
    var scriptName = path.basename(ERROR_FILE);
    var fs = require('fs');
    var logStream = fs.createWriteStream(scriptName, { flags: 'a' });
    logStream.write(date.format((new Date(Date.now())), 'YYYY/MM/DD HH:mm:ss') + '\n');
    logStream.write(info + '\n');
    logStream.write(error + '\n');
    logStream.end('\n');
}
handleDisconnect()

setInterval(() => {
    try {
        checkIfEntry()
    } catch (error) {
        logError("Error in interval calling checkIfEntry", error)
    }
}, 10000);










