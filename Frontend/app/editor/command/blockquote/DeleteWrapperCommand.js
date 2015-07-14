/**
 * Удаляет blockquote из выделения, сохраняя всех его потомков.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.command.blockquote.DeleteWrapperCommand',
	{
		extend: 'FBEditor.editor.command.AbstractDeleteWrapperCommand',

		elementName: 'blockquote'
	}
);