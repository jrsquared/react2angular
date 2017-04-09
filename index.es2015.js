import { fromPairs } from 'lodash';
import NgComponent from 'ngcomponent';
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
/**
 * Wraps a React component in Angular. Returns a new Angular component.
 *
 * Usage:
 *
 *   ```ts
 *   type Props = { foo: number }
 *   class ReactComponent extends React.Component<Props, S> {}
 *   const AngularComponent = react2angular(ReactComponent, ['foo'])
 *   ```
 */
export function react2angular(Class, bindingNames) {
    const names = bindingNames
        || (Class.propTypes && Object.keys(Class.propTypes))
        || [];
    return {
        bindings: fromPairs(names.map(name => {
            let bindingName = name;
            let bindingValue = '<';
            if (name.startsWith('&')) {
                bindingName = bindingName.substring(1);
                bindingValue = '&';
            }
            return [bindingName, bindingValue];
        })),
        controller: ['$element', class extends NgComponent {
                constructor($element) {
                    super();
                    this.$element = $element;
                }
                render() {
                    render(React.createElement(Class, Object.assign({}, this.props)), this.$element[0]);
                }
                componentWillUnmount() {
                    unmountComponentAtNode(this.$element[0]);
                }
            }]
    };
}
//# sourceMappingURL=index.js.map