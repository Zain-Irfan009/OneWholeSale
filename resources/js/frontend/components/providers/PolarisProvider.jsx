import { useCallback } from "react";
import { Link as ReactRouterLink } from 'react-router-dom';
import { AppProvider } from "@shopify/polaris";
// import { useNavigate } from "@shopify/app-bridge-react";
import translations from "@shopify/polaris/locales/en.json";
import "@shopify/polaris/build/esm/styles.css";

export function PolarisProvider({ children }) {



  return (
    <AppProvider
      linkComponent={Link}
      i18n={{
        Polaris: {
          Avatar: {
            label: 'Avatar',
            labelWithInitials: 'Avatar with initials {initials}',
          },
          ContextualSaveBar: {
            save: 'Save',
            discard: 'Discard',
          },
          TextField: {
            characterCount: '{count} characters',
          },
          TopBar: {
            toggleMenuLabel: 'Toggle menu',
            SearchField: {
              clearButtonLabel: 'Clear',
              search: 'Search',
            },
          },
          Modal: {
            iFrameTitle: 'body markup',
          },
          Frame: {
            skipToContent: 'Skip to content',
            navigationLabel: 'Navigation',
            Navigation: {
              closeMobileNavigationLabel: 'Close navigation',
            },
          },
        },
      }}
    >
      {children}
    </AppProvider>
  );
}

function Link({ children, url = '', ...rest }) {
  // Use an regular a tag for external and download links
  if (isOutboundLink(url) || rest.download) {
    return (
      <a href={url} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <ReactRouterLink to={url} {...rest}>
      {children}
    </ReactRouterLink>
  );
}

function isOutboundLink(url) {
  return /^(?:[a-z][a-z\d+.-]*:|\/\/)/.test(url);
}