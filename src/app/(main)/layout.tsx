"use client";
import React from "react";
import { Layout, Typography } from "antd";
import NavBar from "../../components/navbar/NavBar";
import { useMainLayoutStyles } from "./styles/layoutStyle";
import { UsersProvider } from "@/providers/usersProvider";
import { ClientsProvider } from "@/providers/clientsProvider";
import { ContactsProvider } from "@/providers/contactsProvider";
import { OpportunitiesProvider } from "@/providers/opportunitiesProvider";
import { PricingRequestsProvider } from "@/providers/pricingRequestsProvider";
import { ProposalsProvider } from "@/providers/proposalsProvider";
import { ContractsProvider } from "@/providers/contractsProvider";
import { ActivitiesProvider } from "@/providers/activitiesProvider";
import { DocumentsProvider } from "@/providers/documentsProvider";

const { Content, Footer } = Layout;
const { Text } = Typography;

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { styles } = useMainLayoutStyles();

  return (
    <Layout className={styles.layout} hasSider>

      {/* Fixed sidebar */}
      <NavBar />

      {/* Main content — offset by sidebar width */}
      <div className={styles.siderOffset}>
        <DocumentsProvider>
          <Content className={styles.content}>
            <UsersProvider>
              <ClientsProvider>
                <ContactsProvider>
                  <OpportunitiesProvider>
                    <PricingRequestsProvider>
                      <ProposalsProvider>
                        <ContractsProvider>
                          <ActivitiesProvider>
                            {children}
                          </ActivitiesProvider>
                        </ContractsProvider>
                      </ProposalsProvider>
                    </PricingRequestsProvider>
                  </OpportunitiesProvider>
                </ContactsProvider>
              </ClientsProvider>
            </UsersProvider>
          </Content>
        </DocumentsProvider>

        <Footer className={styles.footer}>
          <Text className={styles.footerText}>Salecore © 2025</Text>
        </Footer>
      </div>

    </Layout>
  );
}