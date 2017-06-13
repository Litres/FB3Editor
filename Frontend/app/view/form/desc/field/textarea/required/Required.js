/**
 * Обязательное текстовое поле.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.field.textarea.required.Required',
	{
		extend: 'Ext.form.field.TextArea',
		mixins: {
			required: 'FBEditor.view.form.desc.field.Required'
		},

		xtype: 'desc-field-textarea-required',

		allowBlank: false,

		_cls: 'field-required',

		listeners: {
			dirtychange: function ()
			{
				this.checkChangeCls()
			}
		},

		afterRender: function ()
		{
			var me = this;

			me.callParent(arguments);

			me.checkChangeCls();
		},

		/**
		 * Изменяет класс в зависимости от валидности.
		 */
		checkChangeCls: function ()
		{
			this.mixins.required.checkChangeCls.call(this);
		}
	}
);