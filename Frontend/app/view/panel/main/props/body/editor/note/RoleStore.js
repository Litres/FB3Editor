/**
 * Типы сноски.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.note.RoleStore',
	{
		extend: 'Ext.data.Store',

		fields: [
			'value',
			'text'
		],

		data: [
			{value: 'auto', text: 'auto'},
			{value: 'footnote', text: 'footnote'},
			{value: 'endnote', text: 'endnote'},
			{value: 'comment', text: 'comment'},
			{value: 'other', text: 'other'}
		]
	}
);