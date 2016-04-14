/**
 * Текстовое поле с тригером для очищения поля.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.textfieldclear.TextFieldClear',
	{
		extend: 'Ext.form.field.Text',

		xtype: 'textfieldclear',

		triggers: {
			foo: {
				cls: 'textfieldclear-trigger',
				handler: function()
				{
					this.setValue('');
				}
			}
		}
	}
);