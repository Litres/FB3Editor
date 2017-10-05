/**
 * Кнопка удаления ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.DeleteResource',
	{
		extend: 'FBEditor.view.button.AbstractOperationResource',
		requires: [
			'FBEditor.command.DeleteResource'
		],

		id: 'button-delete-resource',
		xtype: 'button-delete-resource',

		text: 'Удалить',
		cmdClass: 'FBEditor.command.DeleteResource'
	}
);