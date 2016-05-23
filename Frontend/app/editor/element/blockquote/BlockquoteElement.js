/**
 * Элемент blockquote.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.blockquote.BlockquoteElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.blockquote.BlockquoteElementController',
			'FBEditor.editor.command.blockquote.SplitCommand',
			'FBEditor.editor.command.blockquote.CreateCommand',
			'FBEditor.editor.command.blockquote.CreateRangeCommand',
			'FBEditor.editor.command.blockquote.DeleteWrapperCommand'
		],
		controllerClass: 'FBEditor.editor.element.blockquote.BlockquoteElementController',
		htmlTag: 'blockquote',
		xmlTag: 'blockquote',
		cls: 'el-blockquote',
		splittable: true,

		isBlockquote: true,

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Цитата');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		}
	}
);