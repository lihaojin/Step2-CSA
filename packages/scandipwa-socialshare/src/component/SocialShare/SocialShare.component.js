import PropTypes from 'prop-types';
import { PureComponent } from 'react';
import {
   EmailIcon,
   EmailShareButton,
   FacebookIcon,
   FacebookMessengerIcon,
   FacebookMessengerShareButton,
   FacebookShareButton,
   FacebookShareCount,
   LinkedinIcon,
   LinkedinShareButton,
   TelegramIcon,
   TelegramShareButton,
   WhatsappIcon,
   WhatsappShareButton
} from 'react-share';

import {
   EMAIL,
   FACEBOOK,
   FACEBOOK_MSG,
   LINKEDIN,
   TELEGRAM,
   WHATSAPP
} from './SocialShare.config';

import './SocialShare.style';

/** @namespace ScandipwaSocialshare/Component/SocialShare/Component/SocialShareComponent */
export class SocialShareComponent extends PureComponent {
   static propTypes = {
       providers: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
       size: PropTypes.string.isRequired,
       isRounded: PropTypes.bool.isRequired,
       quote: PropTypes.string.isRequired
   };

   renderMap = {
       [FACEBOOK]: {
           render: (counter, additional, shareUrl) => this.renderFaceBook(counter, additional, shareUrl)
       },
       [EMAIL]: {
           render: (counter, additional, shareUrl) => this.renderEmail(counter, additional, shareUrl)
       },
       [FACEBOOK_MSG]: {
           render: (counter, additional, shareUrl) => this.renderMessenger(counter, additional, shareUrl)
       },
       [TELEGRAM]: {
           render: (counter, additional, shareUrl) => this.renderTelegram(counter, additional, shareUrl)
       },
       [WHATSAPP]: {
           render: (counter, additional, shareUrl) => this.renderWhatsApp(counter, additional, shareUrl)
       },
       [LINKEDIN]: {
           render: (counter, additional, shareUrl) => this.renderLinkedIn(counter, additional, shareUrl)
       }
   };

   renderLinkedIn(counter, additional, shareUrl) {
       const { size, isRounded } = this.props;

       return (
           <LinkedinShareButton
             url={ shareUrl }
           >
               <LinkedinIcon
                 size={ size }
                 round={ isRounded }
               />
           </LinkedinShareButton>
       );
   }

   renderFaceBook(counter, _, shareUrl) {
       const { size, isRounded, quote } = this.props;

       return (
           <>
               <FacebookShareButton
                 url={ shareUrl }
                 quote={ quote }
               >
                   <FacebookIcon
                     size={ size }
                     round={ isRounded }
                   />
               </FacebookShareButton>
               { this.renderFaceBookCounter(counter, shareUrl) }
           </>
       );
   }

   renderMessenger(counter, additional, shareUrl) {
       const { size, isRounded } = this.props;

       return (
           <FacebookMessengerShareButton
             url={ shareUrl }
             appId={ additional }
           >
               <FacebookMessengerIcon
                 size={ size }
                 round={ isRounded }
               />
           </FacebookMessengerShareButton>
       );
   }

   renderTelegram(counter, additional, shareUrl) {
       const { size, isRounded, quote } = this.props;

       return (
           <TelegramShareButton
             url={ shareUrl }
             title={ quote }
           >
               <TelegramIcon
                 size={ size }
                 round={ isRounded }
               />
           </TelegramShareButton>
       );
   }

   renderWhatsApp(counter, additional, shareUrl) {
       const { size, isRounded, quote } = this.props;

       return (
           <WhatsappShareButton
             url={ shareUrl }
             title={ quote }
             separator=" | "
           >
               <WhatsappIcon
                 size={ size }
                 round={ isRounded }
               />
           </WhatsappShareButton>
       );
   }

   // Counter is not working for now https://github.com/nygardk/react-share/issues/347
   // TODO: Update package when issue will be fixed
   renderFaceBookCounter(counter, shareUrl) {
       if (!counter) {
           return null;
       }

       return (
           <FacebookShareCount url={ shareUrl }>
               { (count) => count }
           </FacebookShareCount>
       );
   }

   renderEmail(counter, additional, shareUrl) {
       const { size, isRounded, quote } = this.props;

       return (
           <EmailShareButton
             url={ shareUrl }
             subject={ `${additional} | ${quote}` }
           >
               <EmailIcon size={ size } round={ isRounded } />
           </EmailShareButton>
       );
   }

   renderProvider(provider) {
       const shareUrl = window.location.href;
       const { id, counter, additional } = provider;
       const { render } = this.renderMap[id];

       return (
           <div block="SocialShare" elem="Provider">
               { render(counter, additional, shareUrl) }
           </div>
       );
   }

   render() {
       const { providers } = this.props;

       return (
           <div block="SocialShare">
               { providers.map((provider) => this.renderProvider(provider)) }
           </div>
       );
   }
}

export default SocialShareComponent;
