/**
 * Автотекст.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.props.body.editor.note.AutotextStore',
    {
        extend: 'Ext.data.Store',

        fields: [
            'value',
            'text'
        ],

        data: [
            {value: '1', text: '1, 2, 3'},
            {value: 'i', text: 'I, II, III'},
            {value: 'a', text: 'a, b, c'},
            {value: '*', text: '*, **, ***'},
            {value: 'keep', text: 'без автонумерации'}
        ]
    }
);