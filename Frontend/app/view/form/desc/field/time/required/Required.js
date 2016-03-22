/**
 * Обязательное поле времени.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.field.time.required.Required',
	{
		extend: 'Ext.form.field.Time',
		mixins: {
			required: 'FBEditor.view.form.desc.field.Required'
		},
		xtype: 'desc-field-time-required',
		allowBlank: false,

		_cls: 'field-required',

		listeners: {
			change: function ()
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