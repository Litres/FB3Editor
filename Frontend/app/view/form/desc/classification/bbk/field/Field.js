/**
 * Поле ввода ББК.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.bbk.field.Field',
	{
		extend: 'FBEditor.view.field.textfieldclear.TextFieldClear',
		requires: [
			'FBEditor.view.form.desc.classification.bbk.field.FieldController'
		],

		xtype: 'form-desc-classification-bbk-field',
		controller: 'form.desc.classification.bbk.field',

		name: 'classification-bbk',

		listeners: {
			paste: 'onPaste'
		},

		plugins: {
			ptype: 'fieldCleaner',
			style: 'display: none'
		},

		inputAttrTpl: "spellcheck=\"false\"",
		flex: 1,
		regex: /^[\(\)=:\d\.\-A-Яа-я/\+ "]+$/,

		translateText: {
			bbk: 'Код ББК',
			bbkError: 'По шаблону [\\(\\)=:\\d\\.\\-A-Яа-я/\\+ "]+'
		},

		initComponent: function ()
		{
			var me = this;

			me.fieldLabel = me.translateText.bbk;
			me.regexText = me.translateText.bbkError;
			me.afterBodyEl = '<span class="after-body">' + me.translateText.bbkError + '</span>';

			me.callParent(arguments);
		}
	}
);