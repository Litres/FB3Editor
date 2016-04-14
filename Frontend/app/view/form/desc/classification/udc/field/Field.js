/**
 * Поле ввода УДК.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.classification.udc.field.Field',
	{
		extend: 'FBEditor.view.field.textfieldclear.TextFieldClear',
		requires: [
			'FBEditor.view.form.desc.classification.udc.field.FieldController'
		],

		xtype: 'form-desc-classification-udc-field',
		controller: 'form.desc.classification.udc.field',

		name: 'classification-udc',

		listeners: {
			paste: 'onPaste'
		},

		plugins: {
			ptype: 'fieldCleaner',
			style: 'display: none'
		},

		flex: 1,
		regex: /^[\d\. \-\*\(\):\[\]\+:=&quot;«»'/A-Яа-я]+$/,

		translateText: {
			udc: 'Код УДК',
			udcError: 'По шаблону [\\d\\. \\-\\*\\(\\):\\[\\]\\+:=&quot;«»\'/A-Яа-я]+'
		},

		initComponent: function ()
		{
			var me = this;

			me.fieldLabel = me.translateText.udc;
			me.regexText = me.translateText.udcError;
			me.afterBodyEl = '<span class="after-body">' + me.translateText.udcError + '</span>';

			me.callParent(arguments);
		}
	}
);