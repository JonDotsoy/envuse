export const tmLanguage = {
  fileTypes: ["envuse"],
  name: "envuse",
  patterns: [
    {
      include: "#main",
    },
  ],
  scopeName: "source.envuse",
  uuid: "4b0672cb-8881-4e15-bda7-a9a24ea8bba5",
  repository: {
    main: {
      patterns: [
        {
          begin: "^(\\s*#;\\s*(?:if))",
          beginCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
          patterns: [
            {
              include: "#main__1",
            },
          ],
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
        {
          begin: "^(\\s*###)",
          beginCaptures: {
            "1": {
              name: "comment.block.documentation, comment.envuse",
            },
          },
          contentName: "comment.block.documentation, comment.envuse",
          end: "(###\\s*)$",
          endCaptures: {
            "1": {
              name: "comment.block.documentation, comment.envuse",
            },
          },
        },
        {
          begin: "(#)",
          beginCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
          contentName: "comment.envuse",
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
        {
          begin: "([a-zA-Z0-9][a-zA-Z0-9_-]*)",
          beginCaptures: {
            "1": {
              name: "variable, variable.other.envuse",
            },
          },
          patterns: [
            {
              include: "#main__4",
            },
          ],
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
      ],
    },
    main__1: {
      patterns: [
        {
          include: "#sentences",
        },
      ],
    },
    main__2: {
      patterns: [],
    },
    main__3: {
      patterns: [],
    },
    main__4: {
      patterns: [
        {
          begin: "(:)",
          beginCaptures: {
            "1": {
              name: "constant.other.symbol.envuse",
            },
          },
          patterns: [
            {
              include: "#main__5",
            },
          ],
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
        {
          include: "#variable_part_value_string",
        },
      ],
    },
    main__5: {
      patterns: [
        {
          begin: "(number)",
          beginCaptures: {
            "1": {
              name: "support.type.envuse",
            },
          },
          patterns: [
            {
              include: "#main__6",
            },
          ],
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
        {
          begin: "(boolean)",
          beginCaptures: {
            "1": {
              name: "support.type.envuse",
            },
          },
          patterns: [
            {
              include: "#main__7",
            },
          ],
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
        {
          begin: "([a-zA-Z0-9][a-zA-Z0-9_-]*)",
          beginCaptures: {
            "1": {
              name: "support.type.envuse",
            },
          },
          patterns: [
            {
              include: "#main__8",
            },
          ],
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
      ],
    },
    main__6: {
      patterns: [
        {
          include: "#variable_part_value_number",
        },
      ],
    },
    main__7: {
      patterns: [
        {
          include: "#variable_part_value_boolean",
        },
      ],
    },
    main__8: {
      patterns: [
        {
          include: "#variable_part_value_string",
        },
      ],
    },
    sentences: {
      patterns: [
        {
          begin: '(")',
          beginCaptures: {
            "1": {
              name: "string.envuse",
            },
          },
          contentName: "string.envuse",
          end: '(")',
          endCaptures: {
            "1": {
              name: "string.envuse",
            },
          },
        },
        {
          begin: "(')",
          beginCaptures: {
            "1": {
              name: "string.envuse",
            },
          },
          contentName: "string.envuse",
          end: "(')",
          endCaptures: {
            "1": {
              name: "string.envuse",
            },
          },
        },
        {
          match: "(-?\\d(_?\\d)*(?:(?:\\.(?:\\d(_?\\d)*))|n)?)",
          name: "constant.numeric.envuse",
        },
        {
          match: "(true|false)",
          name: "constant.language, constant.language.boolean.envuse",
        },
        {
          match: "(null)",
          name: "constant.language,constant.language.null.envuse",
        },
        {
          match: "(undefined)",
          name: "constant.language,constant.language.undefined.envuse",
        },
        {
          match: "([a-zA-Z0-9][a-zA-Z0-9_-]*)",
          name: "variable, variable punctuation.envuse",
          comment: "Variable Name",
        },
        {
          match: "(===)",
          name: "constant.other.symbol.envuse",
          comment: "Symbol Equal",
        },
      ],
    },
    sentences__1: {
      patterns: [],
    },
    sentences__2: {
      patterns: [],
    },
    variable_part_value_boolean: {
      patterns: [
        {
          begin: "(=)",
          beginCaptures: {
            "1": {
              name: "constant.other.symbol.envuse",
            },
          },
          patterns: [
            {
              include: "#variable_part_value_boolean__1",
            },
          ],
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
      ],
    },
    variable_part_value_boolean__1: {
      patterns: [
        {
          begin: "(true|false)",
          beginCaptures: {
            "1": {
              name: "constant.language, constant.language.boolean.envuse",
            },
          },
          patterns: [
            {
              include: "#variable_part_value_boolean__2",
            },
          ],
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
      ],
    },
    variable_part_value_boolean__2: {
      patterns: [
        {
          begin: "(?:(# *.*)?)",
          beginCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
          contentName: "none.envuse",
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
      ],
    },
    variable_part_value_boolean__3: {
      patterns: [],
    },
    variable_part_value_number: {
      patterns: [
        {
          begin: "(=)",
          beginCaptures: {
            "1": {
              name: "constant.other.symbol.envuse",
            },
          },
          patterns: [
            {
              include: "#variable_part_value_number__1",
            },
          ],
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
      ],
    },
    variable_part_value_number__1: {
      patterns: [
        {
          begin: "(-?\\d(_?\\d)*(?:(?:\\.(?:\\d(_?\\d)*))|n)?)",
          beginCaptures: {
            "1": {
              name: "constant.numeric.envuse",
            },
          },
          patterns: [
            {
              include: "#variable_part_value_number__2",
            },
          ],
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
      ],
    },
    variable_part_value_number__2: {
      patterns: [
        {
          begin: "(?:(# *.*)?)",
          beginCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
          contentName: "none.envuse",
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
      ],
    },
    variable_part_value_number__3: {
      patterns: [],
    },
    variable_part_value_string: {
      patterns: [
        {
          begin: "(=)",
          beginCaptures: {
            "1": {
              name: "constant.other.symbol.envuse",
            },
          },
          patterns: [
            {
              include: "#variable_part_value_string__1",
            },
          ],
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
      ],
    },
    variable_part_value_string__1: {
      patterns: [
        {
          begin: "((?:\".*\")|(?:'.*')|(?:[^\\x{0023}]*))",
          beginCaptures: {
            "1": {
              name: "string.envuse",
            },
          },
          patterns: [
            {
              include: "#variable_part_value_string__2",
            },
          ],
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
      ],
    },
    variable_part_value_string__2: {
      patterns: [
        {
          begin: "(?:(# *.*)?)",
          beginCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
          contentName: "none.envuse",
          end: "(^(?=.{0,1})(?:|))",
          endCaptures: {
            "1": {
              name: "comment.envuse",
            },
          },
        },
      ],
    },
    variable_part_value_string__3: {
      patterns: [],
    },
  },
} as const;
