/**
 * Кнопка перемещения ресурса.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.button.MoveResource',
	{
		extend: 'FBEditor.view.button.AbstractOperationResource',
		requires: [
			'FBEditor.command.MoveResource'
		],

		id: 'button-move-resource',
		xtype: 'button-move-resource',

		text: 'Переместить',
		cmdClass: 'FBEditor.command.MoveResource'
	}
);