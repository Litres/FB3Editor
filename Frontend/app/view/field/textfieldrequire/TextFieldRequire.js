/**
 * Текстовое поле, необходимое для заполнения.
 * Содержит тригер для очищения поля.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.field.textfieldrequire.TextFieldRequire',
	{
		extend: 'Ext.form.field.Text',
		xtype: 'textfieldrequire',
		allowBlank: false,
		triggers: {
			foo: {
				cls: 'fa textfieldrequire-trigger',
				handler: function()
				{
					this.setValue('');
				}
			}
		}
	}
);