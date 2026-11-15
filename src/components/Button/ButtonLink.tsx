import { createLink } from '@tanstack/react-router';

import ButtonAnchor from './ButtonAnchor';

// a router Link that looks like a Button: <ButtonLink variant="link" to="." search={…}>
const ButtonLink = createLink(ButtonAnchor);

export default ButtonLink;
