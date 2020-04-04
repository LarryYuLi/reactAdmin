import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

export default class RichTextEditor extends Component {

    static propTypes = {
        detail: PropTypes.string
    }

    state = {
        editorState: EditorState.createEmpty(),
    }

    constructor(props) {
        super(props);
        // update product, generate html content by product's data
        const html = this.props.detail
        if (html) {
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                }
            }
        }
        // else {
        //     this.state = {
        //         editorState: EditorState.createEmpty(),
        //     }
        // }
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        })
    }

    // get html format text
    getDetail = () => {
        const { editorState } = this.state
        return draftToHtml(convertToRaw(editorState.getCurrentContent()))
    }

    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorStyle={{ border: '1px solid', minHeight: 200, padding: 10 }}
                editorState={editorState}
                onEditorStateChange={this.onEditorStateChange}
            />
        )
    }
}