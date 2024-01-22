describe("Navigation", () => {
  it("should handle incorrect email and display error message", () => {
    // Start from the index page
    cy.visit("http://localhost:3010/");

    // Find input type email and type in incorrect email
    const incorrectEmail = "example@email.com";
    cy.get('input[type="email"]').clear().type(incorrectEmail);

    // Find button type submit and click it
    cy.get('button[type="submit"]').click();

    // Wait for the error message to be displayed in the small tag
    cy.get("small").contains("try again").should("be.visible");

    // Find input type email and type in correct email
    const correctEmail = "example@correo.com";
    cy.get('input[type="email"]').clear().type(correctEmail);

    // Find button type submit and click it again
    cy.get('button[type="submit"]').click();

    // Wait for redirection to the dashboard page
    cy.url().should("include", "/dashboard");
    cy.get("small").contains(correctEmail).should("be.visible");

    // Wait for redirection to the dashboard page
    cy.url().should("include", "/dashboard");
    cy.get("small").contains("example@correo.com").should("be.visible");

    // Scroll down to show the footer
    cy.scrollTo("bottom");

    // Scroll up to show the header
    cy.scrollTo("top");

    // Find button containing "Clients" and click it
    cy.get("button").contains("Clients").click();

    // Wait for the MuiDataGrid div to be loaded in the DOM
    cy.get(".MuiDataGrid-root").should("exist").should("be.visible");

    // Find button containing "Home" and click it
    cy.get("button").contains("Home").click();

    // Wait for redirection to the home page "/"
    cy.url().should("include", "/");

    // Find button containing "Sign out" and click it
    cy.get("button").contains("Sign out").click();
  });
});
