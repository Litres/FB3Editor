/**
 * Текстовое поле жанра.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.subject.field.SubjectField',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.form.desc.subject.field.SubjectFieldController'
		],
		xtype: 'form-desc-subject-field',
		controller: 'form.desc.subject.field',
		name: 'classification-subject',
		allowBlank: false,
		editable: false,
		cls: 'field-required',
		listeners: {
			click: {
				element: 'el',
				fn: 'onClick'
			}
		},

		/**
		 * Переписывает стандартный метод возврата значения поля.
		 * @return {String} Часть значения поля, которая содержится в скобках.
		 */
		getValue: function ()
		{
			var me = this,
			val;

			val = me.callParent();
			val = val.replace(/.*?\((.*?)\)$/, '$1');

			return val;
		},

		/**
		 * Переписывает стандартный метод установки значения поля.
		 * @param {String} value Значение поля.
		 */
		setValue: function (value)
		{
			var me = this,
				val = value,
				tree,
				name = value;

			if (val && Ext.isString(val) && (val.indexOf('(') === -1))
			{
				tree = Ext.getCmp('form-desc-subjectTree');
				name = tree.getNameByValue(val);
			}
			me.callParent([name]);
		}
	}
);