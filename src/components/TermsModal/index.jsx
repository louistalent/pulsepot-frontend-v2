import React, { useState } from 'react';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Box from '@material-ui/core/Box';
import Backdrop from '@material-ui/core/Backdrop';
import Typography from '@material-ui/core/Typography';
import Checkbox from 'react-custom-checkbox';
import Button from 'react-bootstrap/Button';
import './index.css';

const TermsModal = (props) => {
  const { open, onClose } = props;
  const [checked, setChecked] = useState(false);
  return (
    <Modal
      className="terms-modal"
      open={open}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <Fade in={open}>
        <Box className="terms-modal-container">
          <Typography className="terms-modal-title" variant="h6" component="h2">
            Terms of service
          </Typography>
          <Box
            className="terms-text-container"
            sx={{
              padding: 20,
              paddingRight: 5,
              color: 'rgb(105, 106, 109)',
              borderRadius: '10px',
              bgcolor: 'rgb(46, 46, 54)',
            }}
          >
            <Box
              className="terms-text"
              sx={{
                paddingRight: 2,
                overflowY: 'auto',
                maxHeight: 200,
                fontSize: 12,
              }}
            >
              <p style={{ marginTop: 0 }}>Before using this Website please read our Terms of service carefully.</p>
              <p>
                1. Responsible gaming <br />
                2. Limitations of Liability and complaints <br />
                3. Eligibility to use <br />
                4. Termination <br />
                5. No warranties <br />
              </p>
              <p>
                <strong>Responsible gaming</strong>
              </p>
              <p>
                Responsible Gaming is a set of social responsibility initiatives by the industry to ensure the integrity
                and fairness of their operations and to promote awareness of harms associated with it.Tips on how to
                play responsibly:
              </p>
              <p>
                ● Don't treat playing on BNBPot as a way to make money - treat it as an entertainment expense;
                <br />
                ● Only play with money you're willing to lose - play with your disposable income;
                <br />
                ● Never chase your losses, there is no guarantee you will come out ahead;
                <br />
                ● Don't play while under the influence of alcohol, drugs or other controlled substances;
                <br />
                ● Don't play while you're not in control of your emotions - never play when you're being depressed or
                upset;
                <br />
                ● Remember to take frequent breaks, or set a playing time limit in advance;
                <br />
              </p>
              <p>
                <strong>Limitation of liability</strong>
              </p>
              <p>
                BNBPot is not liable for any possible financial damage arising from the use of the website and happened
                due to the reasons out of control of BNBPot
              </p>
              <p>
                BNBPot is in no way responsible for any access to a User's account by a third person and will not be
                held responsible for any loss suffered due to the illicit use of a User's password by a third person, of
                unauthorized access, and/or for any transaction in which the name and password of a User was registered
                correctly.
              </p>
              <p>
                BNBPot is not liable for any hardware or software, defects, unstable or lost Internet connections, or
                any other technical errors that may limit User’s access to the website.
              </p>
              <p>BNBPot, its directors, employees, partners, service providers:</p>
              <p>
                1. do not warrant that the software or the Website is/are permanently fit for their purpose;
                <br />
                <br />
                2. do not warrant that the software and Website are permanently free from errors;
                <br />
                <br />
                3. do not warrant that the Website will always be accessible without interruptions;
                <br />
                <br />
                4. You agree that BNBPot shall be the final decision-maker of whether you have violated the BNBPot
                rules, terms or conditions in a manner that results in your suspension or permanent block from
                participation at our website.
                <br />
                <br />
                5. The website can only be used for personal purposes and shall not be used for any type of commercial
                profit.
                <br />
                <br />
                6. Except as otherwise required by law, in no event BNBPot, our directors, members, employees or agents
                shall be liable for any special, indirect or consequential damages, or any other damages of any kind,
                including but not limited to loss of use, loss of profits or loss of data, whether in an action in
                contract, tort (including but not limited to negligence) or otherwise, arising out of or in any way
                connected with the use of or inability to use our services or the BNBPot materials, including without
                limitation any damages caused by or resulting from reliance by any user on any information obtained from
                BNBPot, or actions on the website or that result from mistakes, omissions, interruptions, deletion of
                files, errors, defects, viruses, delays in operation or transmission or any failure of performance,
                whether or not resulting from a force majeure event, communications failure, theft, destruction or
                unauthorized access to BNBPot records, programs or services.
                <br />
                <br />
                7. Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of
                liability for incidental or consequential damages. Accordingly, some of the limitations of this section
                may not apply to certain users.
                <br />
                <br />
                8. BNBPot is not responsible for any damages caused by delay or failure to perform its obligations under
                the agreement if the said delay or failure is due to fires; strikes; floods; power outages or failures;
                acts of god or the state’s enemies; lawful acts of public authorities; any and all acts that are
                regarded as force majeure in legal practice.
                <br />
                <br />
              </p>
              <p>
                <strong>Eligibility to use BNBPot’s services</strong>
              </p>
              <p>
                1. The Website and its services are available to, and may only be used by individuals, who can enter
                into legally binding contracts under the applicable law and reside in countries and geographic regions
                where such online activities are allowed by law. It is the User's sole responsibility to inquire about
                the existing laws and regulations of the given jurisdiction before making purchases on the website.
                <br />
                <br />
                2. The User assures BNBPot that he/she is over 18 years old or such legal age of majority as stipulated
                in the jurisdiction of his/her residence. We may require you to provide proof of age. User must be a
                natural individual, not a legal entity or corporate body. The User must be able to enter into legally
                binding contracts. The User must reside in countries and geographic regions where the Services are
                allowed by law. The User must not reside in Washington state.
                <br />
                3. The User guarantees at all times not to be a resident or citizen of countries where our services are
                prohibited by local legislation. Players from such countries are not eligible to use the Website and use
                its services. BNBPot will make all reasonable efforts to prevent players from these countries from
                reaching the services.
                <br />
              </p>
              <p>
                <strong>Termination</strong>
              </p>
              <p>
                We may terminate or suspend access to our Service immediately, without prior notice or liability, for
                any reason whatsoever, including without limitation if you breach these Terms.
              </p>
              <p>
                All provisions of the Terms which by their nature should survive termination shall survive termination,
                including, without limitation, ownership provisions, warranty disclaimers, indemnity and limitations of
                liability.
              </p>
              <p>
                <strong>No warranties</strong>
              </p>
              <p>
                This website is provided “as is” without any representations or warranties, express or implied. BNBPot
                makes no representations or warranties in relation to this Site or the information and materials
                provided on the Site. Without prejudice to the generality of the foregoing paragraph, BNBPot does not
                warrant that the Site will be constantly available, or available at all, or the information on this
                website is complete, true, accurate or non-misleading.
              </p>
              <p>
                Nothing on this website constitutes, or is meant to constitute, advice of any kind. If you require
                advice in relation to any legal, financial or medical matter you should consult an appropriate
                professional.
              </p>
              <p>You agree that your use of the website at its sole discretion, volition and at your own risk.</p>
            </Box>
          </Box>
          <Box sx={{ marginTop: 10, display: 'flex' }}>
            <Checkbox
              containerStyle={{ color: 'white' }}
              style={{ background: 'white' }}
              labelStyle={{ marginLeft: 10 }}
              icon={<img src="/assets/checkmark.png" style={{ width: 33, marginLeft: 7, marginBottom: 5 }} alt="" />}
              checked={checked}
              borderColor="#b4b4b4"
              borderRadius={5}
              size={30}
              label="I am 18+ years old, and I accept the terms of service provided"
              onChange={() => setChecked(!checked)}
            />
            <Button className={`accept-btn ${checked && 'active'}`} disabled={!checked} onClick={onClose}>
              Continue
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default TermsModal;
