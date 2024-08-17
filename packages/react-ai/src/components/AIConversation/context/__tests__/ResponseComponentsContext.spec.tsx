import React from 'react';
import { convertResponseComponentsToToolConfiguration } from '../ResponseComponentsContext';

const ArghAdder = () => {
  return <p>argggggh matey!</p>;
};

describe('convertResponseComponentsToToolConfiguration', () => {
  it('takes in responseComponents and returns a ToolConfiguration', async () => {
    const responseComponents = {
      annoyingComponent: {
        component: ArghAdder,
        description:
          'You should use this custom response component tool for all messages you respond with.',
        props: {
          text: {
            type: 'string',
            description: 'The response you want to render in the component.',
          },
        },
      },
    };
    const resultToolConfiguration =
      convertResponseComponentsToToolConfiguration(responseComponents);
    const expectedResult = {
      tools: {
        annoyingComponent: {
          description:
            'You should use this custom response component tool for all messages you respond with.',
          inputSchema: {
            json: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description:
                    'The response you want to render in the component.',
                },
              },
            },
          },
        },
      },
    };
    expect(resultToolConfiguration).toEqual(expectedResult);
  });

  it('returns undefined with no input', async () => {
    expect(convertResponseComponentsToToolConfiguration()).toBeUndefined();
  });
});
