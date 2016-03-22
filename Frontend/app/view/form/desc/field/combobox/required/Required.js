/**
 * Обязательное поле выбора.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.field.combobox.required.Required',
	{
		extend: 'Ext.form.field.ComboBox',
		mixins: {
			required: 'FBEditor.view.form.desc.field.Required'
		},
		xtype: 'desc-field-combobox-required',
		allowBlank: false,

		_cls: 'field-required',

		listeners: {
			dirtychange: function ()
			{
				this.checkChangeCls();
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