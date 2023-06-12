import {
  SkeletonPage,
  Layout,
  Card,
  Stack,
  SkeletonBodyText,
  TextContainer,
  SkeletonDisplayText,
  SkeletonTabs,
  SkeletonThumbnail,
  Button,
} from "@shopify/polaris";
import React from "react";
// import { PaymentLoader } from '../../components'

export function SkeltonPage() {
  return (
    <SkeletonPage primaryAction fullWidth>
      <Layout>
        <Layout.Section secondary>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Card>
        </Layout.Section>

        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}

export function SkeltonDashboardPage() {
  return (
    <SkeletonPage primaryAction fullWidth>
      <Card>
        <SkeletonTabs count={4} />
        <Card.Section sectioned>
          <TextContainer>
            <SkeletonBodyText lines={4} />
          </TextContainer>
        </Card.Section>
      </Card>
      {/* <br />
            <br />
            <br />
            <PaymentLoader /> */}
    </SkeletonPage>
  );
}

export function SkeltonPageWithTabs() {
  return (
    <SkeletonPage primaryAction fullWidth>
      <Card sectioned>
        <SkeletonTabs count={5} />

        <Layout>
          <Layout.Section secondary>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>

            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Layout.Section>

          <Layout.Section>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>

            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Layout.Section>
        </Layout>
      </Card>
    </SkeletonPage>
  );
}

export function SkeltonTabsLayoutSecondary() {
  return (
    <div className="SkeltonTabs">
      <Card sectioned>
        <Layout>
          <Layout.Section secondary>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Layout.Section>

          <Layout.Section>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={6} />
            </TextContainer>
          </Layout.Section>
        </Layout>
      </Card>
    </div>
  );
}

export function SkeltonTabsLayoutFull() {
  return (
    <div className="SkeltonTabs">
      <Card sectioned>
        <Layout>
          <Layout.Section>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={3} />
            </TextContainer>

            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={3} />
            </TextContainer>
          </Layout.Section>
        </Layout>
      </Card>
    </div>
  );
}

export function SkeltonTabsWithThumbnail() {
  return (
    <div className="SkeltonTabs">
      <Card sectioned>
        <Layout>
          <Layout.Section>
            <Stack>
              <SkeletonThumbnail size="small" />
              <SkeletonBodyText lines={2} />
            </Stack>
          </Layout.Section>
        </Layout>
      </Card>

      <Card sectioned>
        <Layout>
          <Layout.Section>
            <Stack>
              <SkeletonThumbnail size="small" />
              <SkeletonBodyText lines={2} />
            </Stack>
          </Layout.Section>
        </Layout>
      </Card>
    </div>
  );
}

export function SkeltonPageForTable() {
  return (
    <SkeletonPage primaryAction fullWidth>
      <Card sectioned>
        <SkeletonTabs count={4} />
        <br />
        <Layout>
          <Layout.Section oneThird>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Layout.Section>

          <Layout.Section oneThird>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Layout.Section>

          <Layout.Section oneThird>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Layout.Section>
        </Layout>
      </Card>
    </SkeletonPage>
  );
}

export function SkeltonPageForProductDetail() {
  return (
    <SkeletonPage primaryAction fullWidth>
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <TextContainer>
              <SkeletonBodyText />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonBodyText />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonBodyText />
            </TextContainer>
          </Card>
        </Layout.Section>

        <Layout.Section secondary>
          <Card>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
          </Card>

          <Card subdued>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
            <Card.Section>
              <SkeletonBodyText lines={2} />
            </Card.Section>
          </Card>
        </Layout.Section>
      </Layout>
    </SkeletonPage>
  );
}

export function SkeltonPaymentPage() {
  return (
    // <SkeletonPage primaryAction fullWidth>
    //     <SkeletonTabs />
    <div
      className="Polaris-Page--fullWidth Polaris-SkeletonPage__Page "
      style={{ maxWidth: "none", padding: "0" }}
    >
      <Layout>
        <Layout.Section oneThird>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
        </Layout.Section>

        <Layout.Section oneThird>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
        </Layout.Section>

        <Layout.Section oneThird>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Card>
        </Layout.Section>
      </Layout>
    </div>
    // </SkeletonPage>
  );
}

export function SkeltonShippingPage() {
  return (
    <SkeletonPage primaryAction fullWidth>
      <SkeletonTabs count={2} />
      <br />
      <Card sectioned>
        <Layout>
          <Layout.Section oneThird>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Layout.Section>

          <Layout.Section oneThird>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Layout.Section>

          <Layout.Section oneThird>
            <TextContainer>
              <SkeletonBodyText lines={4} />
            </TextContainer>
          </Layout.Section>
        </Layout>
      </Card>
    </SkeletonPage>
  );
}
