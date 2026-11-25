// Sorts the properties of every style object in a .css.ts file into groups:
// position, layout, size, spacing, border, colours, text, motion, interaction,
// then the nested blocks (pseudo-classes, selectors, @media, @supports).
// Within a group the order is the one written in GROUPS below.
// A spread (...shared) stays where it is: only the properties between spreads move.

const GROUPS = [
  // custom properties come first: the properties below read them
  ['vars'],
  // position
  [
    'content',
    'position',
    'inset',
    'insetBlock',
    'insetInline',
    'top',
    'right',
    'bottom',
    'left',
    'zIndex',
    'isolation',
    'float',
    'clear',
  ],
  // layout
  [
    'display',
    'visibility',
    'flex',
    'flexFlow',
    'flexDirection',
    'flexWrap',
    'flexGrow',
    'flexShrink',
    'flexBasis',
    'grid',
    'gridTemplate',
    'gridTemplateColumns',
    'gridTemplateRows',
    'gridTemplateAreas',
    'gridAutoFlow',
    'gridAutoColumns',
    'gridAutoRows',
    'gridArea',
    'gridColumn',
    'gridRow',
    'gap',
    'rowGap',
    'columnGap',
    'placeContent',
    'placeItems',
    'placeSelf',
    'alignContent',
    'alignItems',
    'alignSelf',
    'justifyContent',
    'justifyItems',
    'justifySelf',
    'order',
  ],
  // size
  [
    'boxSizing',
    'width',
    'minWidth',
    'maxWidth',
    'inlineSize',
    'minInlineSize',
    'maxInlineSize',
    'height',
    'minHeight',
    'maxHeight',
    'blockSize',
    'minBlockSize',
    'maxBlockSize',
    'aspectRatio',
    'overflow',
    'overflowX',
    'overflowY',
    'overscrollBehavior',
    'overscrollBehaviorX',
    'overscrollBehaviorY',
    'scrollbarGutter',
    'scrollbarWidth',
    'scrollbarColor',
  ],
  // spacing
  [
    'margin',
    'marginBlock',
    'marginInline',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
    'padding',
    'paddingBlock',
    'paddingInline',
    'paddingTop',
    'paddingRight',
    'paddingBottom',
    'paddingLeft',
    'scrollMarginTop',
    'scrollPaddingTop',
  ],
  // border
  [
    'border',
    'borderBlock',
    'borderInline',
    'borderTop',
    'borderRight',
    'borderBottom',
    'borderLeft',
    'borderWidth',
    'borderStyle',
    'borderColor',
    'borderRadius',
    'outline',
    'outlineOffset',
    'boxShadow',
  ],
  // colours
  [
    'colorScheme',
    'background',
    'backgroundColor',
    'backgroundImage',
    'backgroundPosition',
    'backgroundSize',
    'backgroundRepeat',
    'color',
    'caretColor',
    'accentColor',
    'fill',
    'fillOpacity',
    'stroke',
    'strokeWidth',
    'strokeLinecap',
    'strokeLinejoin',
    'strokeDasharray',
    'vectorEffect',
    'opacity',
    'filter',
    'backdropFilter',
    'WebkitBackdropFilter',
    'maskImage',
    'clipPath',
    'forcedColorAdjust',
  ],
  // text
  [
    'font',
    'fontFamily',
    'fontSize',
    'fontWeight',
    'fontStyle',
    'fontVariantNumeric',
    'lineHeight',
    'letterSpacing',
    'textAlign',
    'textTransform',
    'textDecoration',
    'textDecorationSkipInk',
    'textUnderlineOffset',
    'textUnderlinePosition',
    'textWrap',
    'textOverflow',
    'whiteSpace',
    'wordBreak',
    'overflowWrap',
    'verticalAlign',
    'listStyle',
    'WebkitLineClamp',
    'WebkitBoxOrient',
  ],
  // motion
  [
    'transform',
    'transformOrigin',
    'transformBox',
    'translate',
    'rotate',
    'scale',
    'transition',
    'transitionDuration',
    'animation',
    'animationDelay',
    'animationDuration',
    'animationTimeline',
    'animationRange',
    'willChange',
  ],
  // interaction
  [
    'cursor',
    'pointerEvents',
    'userSelect',
    'appearance',
    'WebkitAppearance',
    'resize',
    'scrollBehavior',
  ],
];

const RANK = new Map(
  GROUPS.flatMap((group, groupIndex) =>
    group.map((name, nameIndex) => [name, groupIndex * 1000 + nameIndex])
  )
);

const NESTED_BASE = GROUPS.length * 1000;

function keyName(property) {
  if (property.computed) return null;
  if (property.key.type === 'Identifier') return property.key.name;
  if (property.key.type === 'Literal') return String(property.key.value);

  return null;
}

// the rank of a key, or undefined when the key is not a style key
function rankOf(property) {
  const name = keyName(property);

  if (name === null) return undefined;
  if (name.startsWith('--')) return -1;
  if (RANK.has(name)) return RANK.get(name);
  if (name.startsWith(':')) return NESTED_BASE;
  if (name === 'selectors') return NESTED_BASE + 1;
  if (name === '@media') return NESTED_BASE + 2;
  if (name === '@supports') return NESTED_BASE + 3;
  if (name === '@container') return NESTED_BASE + 4;

  return undefined;
}

export default {
  meta: {
    type: 'layout',
    fixable: 'code',
    messages: {
      order:
        'Sort the style: position, layout, size, spacing, border, colours, text, motion, interaction, then nested blocks. "{{name}}" goes before "{{before}}".',
    },
    schema: [],
  },
  create(context) {
    const sourceCode = context.sourceCode;

    // comments on their own lines above a property travel with it;
    // a comment after it on the same line does too
    function chunkOf(property, previous) {
      const leading = sourceCode
        .getCommentsBefore(property)
        .filter(
          (comment) =>
            !previous || comment.loc.start.line > previous.loc.end.line
        );

      const after = sourceCode.getTokenAfter(property);
      const searchFrom = after && after.value === ',' ? after : property;

      const trailing = sourceCode
        .getCommentsAfter(searchFrom)
        .filter((comment) => comment.loc.start.line === property.loc.end.line);

      const start = leading.length ? leading[0].range[0] : property.range[0];

      return {
        property,
        start,
        leadingText: sourceCode.text.slice(start, property.range[0]),
        text: sourceCode.getText(property),
        trailing: trailing.map((comment) => sourceCode.getText(comment)),
        trailingEnd: trailing.length
          ? trailing[trailing.length - 1].range[1]
          : null,
      };
    }

    function checkSegment(node, segment) {
      const ranks = segment.map((property) => rankOf(property));

      const sorted = segment
        .map((property, index) => ({ property, index, rank: ranks[index] }))
        .sort((one, two) => one.rank - two.rank || one.index - two.index);

      const firstWrong = sorted.findIndex(
        (item, index) => item.index !== index
      );

      if (firstWrong === -1) return;

      const misplaced = sorted[firstWrong].property;
      const before = segment[firstWrong];
      const multiline = node.loc.start.line !== node.loc.end.line;

      const chunks = segment.map((property, index) =>
        chunkOf(property, segment[index - 1])
      );

      const hasComments = chunks.some(
        (chunk) => chunk.leadingText.trim() || chunk.trailing.length
      );

      context.report({
        node: misplaced,
        messageId: 'order',
        data: { name: keyName(misplaced), before: keyName(before) },
        fix:
          !multiline && hasComments
            ? null
            : (fixer) => {
                const last = chunks[chunks.length - 1];
                const end = last.trailingEnd ?? last.property.range[1];
                const finalComma = last.trailingEnd !== null;
                const indent = ' '.repeat(segment[0].loc.start.column);
                const ordered = sorted.map((item) => chunks[item.index]);

                const text = ordered
                  .map((chunk, index) => {
                    const isLast = index === ordered.length - 1;
                    const comma = !isLast || finalComma ? ',' : '';

                    const trailing = chunk.trailing.length
                      ? ` ${chunk.trailing.join(' ')}`
                      : '';

                    const leading = chunk.leadingText
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => `${line}\n${indent}`)
                      .join('');

                    return `${leading}${chunk.text}${comma}${trailing}`;
                  })
                  .join(multiline ? `\n${indent}` : ' ');

                return fixer.replaceTextRange([chunks[0].start, end], text);
              },
      });
    }

    return {
      ObjectExpression(node) {
        const properties = node.properties.filter(
          (property) => property.type === 'Property'
        );

        // only style objects: every key is a known style key, and one is a real property
        if (properties.length < 2) return;
        if (properties.some((property) => rankOf(property) === undefined))
          return;
        if (!properties.some((property) => RANK.has(keyName(property)))) return;

        // spreads split the object: properties never cross a spread
        let segment = [];

        for (const property of node.properties) {
          if (property.type === 'Property') {
            segment.push(property);
          } else {
            if (segment.length > 1) checkSegment(node, segment);

            segment = [];
          }
        }

        if (segment.length > 1) checkSegment(node, segment);
      },
    };
  },
};
