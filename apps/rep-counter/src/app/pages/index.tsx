import { Container } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "../layout/DashboardLayout";

export function LandingPage() {
  return (
    <DashboardLayout>
      <Container maxW="container.md">
        <Link to="/start/">Use quick-start</Link>
      </Container>
    </DashboardLayout>
  );
}
