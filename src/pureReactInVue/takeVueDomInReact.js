import React from 'react';
import {formatClass, formatStyle} from './vueStyleClassTransformer'
import DirectiveHOC from "./FakeDirective";
import resolveRef from "./resolveRef";

function takeVueDomInReact(child, tags, vueInReactCall, division, slotsFormatter, hashList, __top__) {
    if (tags !== 'all' && ! (tags instanceof Array)) {
        tags = tags ? [tags]: []
    }
    if (typeof child.type === 'string' && (tags === 'all' || tags.indexOf(child.type) > -1)) {

        // Resolve ref
        let ref = resolveRef(child)

        const hashMap = {}
        if (hashList) {
            hashList.forEach((val) => {
                hashMap[val] = ''
            })
        }

        const props = {
            style: formatStyle(child.props?.style),
            className: Array.from(new Set(formatClass(child.props?.class))).join(' '),
            ...hashMap,
            ...(ref? {ref}: {})
        }
        // const directives = child.dirs
        let newChildren = child.children || props.children
        if (newChildren) {
            if (["string", "number"].indexOf(typeof newChildren) > -1) {
                newChildren = [newChildren]
            } else {
                newChildren = [...newChildren]
            }
            newChildren.__top__ = __top__
        }
        return DirectiveHOC(child, <child.type {...props}>{slotsFormatter(newChildren, vueInReactCall, hashList)}</child.type>)
    }
    return vueInReactCall([child], null, division)
}

export default takeVueDomInReact
