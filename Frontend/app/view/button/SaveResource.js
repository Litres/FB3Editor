/**
 * Кнопка сохранения ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.SaveResource',
	{
		extend: 'FBEditor.view.button.AbstractOperationResource',
		requires: [
			'FBEditor.command.SaveResource'
		],
		id: 'button-save-resource',
		xtype: 'button-save-resource',
		text: 'Сохранить как...',
		cmdClass: 'FBEditor.command.SaveResource'
	}
);