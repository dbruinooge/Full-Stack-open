Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3003/api/login", {
    username,
    password,
  }).then((response) => {
    localStorage.setItem("loggedUser", JSON.stringify(response.body));
    cy.visit("http://localhost:3000");
  });
});

Cypress.Commands.add("createBlog", (blog) => {
  cy.request({
    url: "http://localhost:3003/api/blogs",
    method: "POST",
    body: blog,
    headers: {
      Authorization: `bearer ${
        JSON.parse(localStorage.getItem("loggedUser")).token
      }`,
    },
  });

  cy.visit("http://localhost:3000");
});

describe("Blog app", function () {
  beforeEach(function () {
    cy.request("POST", "http://localhost:3003/api/testing/reset");
    const user = {
      name: "John Doe",
      username: "newuser",
      password: "letmein",
    };
    cy.request("POST", "http://localhost:3003/api/users", user);
    cy.visit("http://localhost:3000");
  });

  it("login form is shown", function () {
    cy.visit("http://localhost:3000");
    cy.contains("password");
  });

  it("user can login with correct credentials", function () {
    cy.get("#username").type("newuser");
    cy.get("#password").type("letmein");
    cy.get("#login-button").click();

    cy.contains("blogs");
  });

  it("user cannot login with wrong credentials", function () {
    cy.get("#username").type("notauser");
    cy.get("#password").type("supersekret");
    cy.get("#login-button").click();

    cy.contains("Wrong credentials");
  });

  describe("When logged in", function () {
    beforeEach(function () {
      cy.login({ username: "newuser", password: "letmein" });
    });
    it("A blog can be created", function () {
      cy.contains("create new blog").click();
      cy.get("#title").type("A new blog");
      cy.get("#author").type("Mr. Writer");
      cy.get("#url").type("www.blog.com");
      cy.get("#submit_new_blog").click();

      cy.contains("A new blog");
    });

    it("A blog can be liked", function () {
      cy.createBlog({
        title: "Made a blog",
        author: "The author",
        url: "www.somewhere.org",
      });

      cy.contains("view").click();
      cy.contains("like").click();
      cy.contains("likes 1");
    });

    it("A blog can be deleted", function () {
      cy.createBlog({
        title: "Made a blog",
        author: "The author",
        url: "www.somewhere.org",
      });

      cy.contains("view").click();
      cy.contains("remove").click();
      cy.should("not.contain", "Made a blog");
    });

    it("Blogs are displayed in order of likes", function () {
      cy.createBlog({
        title: "Second most likes",
        author: "someone",
        url: "somewhere",
        likes: 5,
      });
      cy.createBlog({
        title: "Third most likes",
        author: "someone",
        url: "somewhere",
        likes: 3,
      });
      cy.createBlog({
        title: "First most likes",
        author: "someone",
        url: "somewhere",
        likes: 7,
      });

      cy.get(".blog").eq(0).contains("First most likes");
      cy.get(".blog").eq(1).contains("Second most likes");
      cy.get(".blog").eq(2).contains("Third most likes");
    });
  });
});
