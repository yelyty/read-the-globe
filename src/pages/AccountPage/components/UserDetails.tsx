import Block from "./Block";
import Field from "../../../components/Field/Field";
import { useState } from "react";
import type { Reader } from "../../../auth/session";

type UserDetailsProps = {
  user: Reader;
};

const UserDetails = ({ user }: UserDetailsProps) => {
  const [name, setName] = useState(user?.signUpName ?? "");
  //   const [nameError, setNameError] = useState<string>();
  //   const [nameStatus, setNameStatus] = useState<string | null>(null);
  //   const [savingName, setSavingName] = useState(false);

  <Block title="Your details">
    <form className={s.form}>
      <Field
        id="ac-name"
        label="Display name"
        autoComplete="name"
        value={name}
        // error={nameError}
        onChange={(event) => setName(event.target.value)}
      />
      <Field
        readOnly
        id="ac-name"
        label="Email"
        type="email"
        aria-describedby="ac-email-hint"
        value={user?.email ?? ""}
        onChange={(event) => setName(event.target.value)}
      />
      <p>The address you sign in with. It can't be changed.</p>
    </form>
  </Block>;
};

export default UserDetails;
