/**
 * Обязательное цифровое поле.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.field.number.required.Required',
	{
		extend: 'Ext.form.field.Number',
		mixins: {
			required: 'FBEditor.view.form.desc.field.Required'
		},
		xtype: 'desc-field-number-required',
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
