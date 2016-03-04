/**
 * Поле даты описания книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.documentInfo.createdDate.CreatedDate',
	{
		extend: 'FBEditor.view.form.desc.date.Date',
		mixins: {
			fieldRequired: 'FBEditor.view.form.desc.field.Required'
		},

		xtype: 'form-desc-documentInfo-createdDate',
		allowBlank: false,
		value: new Date(),

		_cls: 'field-required',

		listeners: {
			change: function ()
			{
				this.checkChangeCls();
			}
		},

		/**
		 * Изменяет класс в зависимости от валидности.
		 */
		checkChangeCls: function ()
		{
			this.mixins.fieldRequired.checkChangeCls.call(this);
		}
	}
);