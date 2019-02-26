/**
 * Панель редактирования элемента section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.section.Editor',
	{
		extend: 'FBEditor.view.panel.main.props.body.editor.AbstractEditor',
		requires: [
			'FBEditor.view.panel.main.props.body.editor.section.output.Output'
		],

		translateText: {
			article: 'article',
			clipped: 'clipped',
            doi: 'doi',
			pos: 'first-char-pos',
            idError: 'Не соответствует схеме fb3d:UUIDType',
            doiError: 'Не соответствует схеме fb3d:DOIType'
		},

		initComponent: function ()
		{
			var me = this;

			me.items = [
				{
                    name: 'id',
                    fieldLabel: 'ID',
                    anchor: '100%',
                    regex: /^[0-9a-fA-F]{8}-([0-9a-fA-F]{4}-){3}[0-9a-fA-F]{12}$/i
				},
				{
					xtype: 'checkbox',
					name: 'article',
					labelAlign: 'left',
					labelWidth: 50,
					fieldLabel: me.translateText.article,
					inputValue: 'true'
				},
                {
                    name: 'doi',
                    fieldLabel: me.translateText.doi,
                    anchor: '100%',
                    regex: /^(10[.][0-9]{3,})(\.[0-9]+)*\/[^"]([^"&amp;&lt;&gt;&apos;])+$/i
                },
                {
                    xtype: 'checkbox',
                    name: 'clipped',
                    labelAlign: 'left',
                    labelWidth: 50,
                    fieldLabel: me.translateText.clipped,
                    inputValue: 'true'
                },
                {
                	xtype: 'numberfield',
                    name: 'first-char-pos',
                    labelAlign: 'left',
                    fieldLabel: me.translateText.pos,
                    minValue: 0
                },
				{
					xtype: 'panel-props-body-editor-section-output'
				}
			];

			me.callParent(arguments);
		}
	}
);