/**
 * Поле редактирования имени файла.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.panel.filename.field.Field',
	{
		extend: 'Ext.form.field.Text',
		requires: [
			'FBEditor.view.panel.filename.field.FieldController'
		],
		id: 'panel-filename-field',
		xtype: 'panel-filename-field',
		controller: 'panel.filename.field',
		border: false,
		allowBlank: false,
		maxLength: 250,
		enforceMaxLength: true,
		width: '100%',
		cls: 'panel-filename-field',
		listeners: {
			blur: 'onBlur',
			activate: 'onActivate',
			specialkey: 'onSpecialKey'
		}
	}
);