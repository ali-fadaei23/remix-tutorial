import { json } from "@remix-run/node";
import {
  Form,
  Links,
  Meta,
  MetaFunction,
  Outlet,
  Scripts,
  useLoaderData,
  ScrollRestoration,
  redirect,
  NavLink,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "./tailwind.css";
import React from "react";
import { createEmptyContact, getContacts } from "./data";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix App Tutorial" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export const loader = async () => {
  const contacts = await getContacts();
  return json({ contacts });
};

export const action = async () => {
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
};

export default function App() {
  const { contacts } = useLoaderData<typeof loader>();
  return (
    <>
      <div id='sidebar'>
        <h1>Remix Contacts</h1>
        <div>
          <Form id='search-form' role='search'>
            <input
              aria-label='Search contacts'
              id='q'
              name='q'
              placeholder='Search'
              type='search'
            />
            <div aria-hidden hidden={true} id='search-spinner' />
          </Form>
          <Form method='post'>
            <button type='submit'>New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>
                  <NavLink
                    className={({ isActive, isPending }) =>
                      isActive ? "active" : isPending ? "pending" : ""
                    }
                    to={`contacts/${contact.id}`}
                  >
                    {contact.first! || contact.last ? (
                      <>
                        {contact.first!} {contact.last}
                      </>
                    ) : (
                      <i>No Name</i>
                    )}{" "}
                    {contact.favorite ? <span>★</span> : null}
                  </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id='detail'>
        <Outlet />
      </div>
    </>
  );
}
