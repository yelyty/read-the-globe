import { useRef, useState, type SubmitEvent } from "react";
import { useRouter } from "@tanstack/react-router";
import { DownloadSimpleIcon, TrashIcon, XIcon } from "@phosphor-icons/react";

import Field from "../../../components/Field/Field";
import type { BookEntry } from "../../../types";
import { deleteAccount } from "../../../api/Profile/deleteAccount";

import { bookCount, exportReadingList } from "./YourData/readingList";
import * as s from "../AccountPage.css";
import Block from "../components/Block";

type DeleteAccountProps = {
  books: BookEntry[];
  names: Record<string, string>;
};

const DeleteAccount = ({ books, names }: DeleteAccountProps) => {
  const router = useRouter();
  const dialog = useRef<HTMLDialogElement>(null);

  const [word, setWord] = useState("");
  const [kept, setKept] = useState("");
  const [error, setError] = useState<string>();
  const [deleting, setDeleting] = useState(false);

  const open = () => {
    setWord("");
    setKept("");
    setError(undefined);
    dialog.current?.showModal();
    document.getElementById("ac-delete-word")?.focus();
  };

  const close = () => dialog.current?.close();

  const submit = async (event: SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (word.trim().toLowerCase() !== "delete") return;
    setDeleting(true);
    const problem = await deleteAccount();
    setDeleting(false);
    if (problem) {
      setError("Your account couldn’t be deleted. Try again.");
      return;
    }
    close();
    router.clearCache();
    await router.navigate({ to: "/" });
  };

  return (
    <Block title="Start over" danger>
      <div className={s.dangerItem}>
        <h3 className={s.itemTitle}>Delete account</h3>
        <p className={s.itemText}>
          Removes your account and your atlas. This can’t be undone.
        </p>
        <button
          type="button"
          className={s.dangerOutline}
          aria-haspopup="dialog"
          onClick={open}
        >
          <TrashIcon aria-hidden="true" />
          Delete account
        </button>

        <dialog
          ref={dialog}
          className={s.dialog}
          aria-labelledby="ac-delete-title"
          aria-describedby="ac-delete-q"
          onClick={(event) => {
            if (event.target === event.currentTarget) close();
          }}
        >
          <form onSubmit={submit} noValidate>
            <div className={s.dialogHead}>
              <h2 className={s.dialogTitle} id="ac-delete-title">
                Delete your account?
              </h2>
              <button
                type="button"
                className={s.close}
                aria-label="Close"
                onClick={close}
              >
                <XIcon aria-hidden="true" />
              </button>
            </div>
            <p className={s.dialogText} id="ac-delete-q">
              This deletes your account
              {books.length ? ` and ${bookCount(books.length)}` : ""}. It can’t
              be undone.
            </p>
            {books.length > 0 && (
              <div className={s.keepCopy}>
                <p>Want to keep your books? Save a copy first.</p>
                <button
                  type="button"
                  className={s.linkBtn}
                  onClick={() => {
                    exportReadingList(books, names);
                    setKept(
                      `Saved ${bookCount(books.length)} to your downloads.`,
                    );
                  }}
                >
                  <DownloadSimpleIcon aria-hidden="true" />
                  Download reading list (CSV)
                </button>
                <span className={s.status} role="status">
                  {kept}
                </span>
              </div>
            )}
            <Field
              id="ac-delete-word"
              label="Type delete to confirm"
              autoComplete="off"
              spellCheck={false}
              autoCapitalize="off"
              value={word}
              error={error}
              onChange={(event) => setWord(event.target.value)}
            />
            <div className={s.dialogActions}>
              <button type="button" className={s.linkBtn} onClick={close}>
                Keep account
              </button>
              <button
                type="submit"
                className={s.danger}
                disabled={word.trim().toLowerCase() !== "delete" || deleting}
              >
                <TrashIcon aria-hidden="true" />
                Delete account
              </button>
            </div>
          </form>
        </dialog>
      </div>
    </Block>
  );
};

export default DeleteAccount;
