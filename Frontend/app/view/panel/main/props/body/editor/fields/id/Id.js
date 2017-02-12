/**
 * Поле для айди элемента.
 * Айди должен соответствовать схеме xsd:ID
 * http://www.datypic.com/sc/xsd/t-xsd_NCName.html
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.main.props.body.editor.fields.id.Id',
	{
		extend: 'Ext.form.field.Text',

		xtype: 'panel-props-body-editor-fields-id',
		
		name: 'id',
		fieldLabel: 'ID',
		anchor: '100%',
		regex: /^[_a-z0-9][0-9a-z._-]*$/i,

		translateText: {
			idError: 'Не соответствует схеме xsd:ID'
		},

		initComponent: function ()
		{
			var me = this;

			me.regexText = me.translateText.idError;

			me.callParent(arguments);
		}
	}
);