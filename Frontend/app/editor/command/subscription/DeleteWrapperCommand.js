/**
 * Удаляет subscription из выделения, сохраняя всех его потомков.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.subscription.DeleteWrapperCommand',
	{
		extend: 'FBEditor.editor.command.AbstractDeleteWrapperCommand',

		elementName: 'subscription'
	}
);