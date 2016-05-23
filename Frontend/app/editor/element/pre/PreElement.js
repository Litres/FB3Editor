/**
 * Элемент pre.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.pre.PreElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.element.pre.PreElementController',
			'FBEditor.editor.command.pre.SplitCommand',
			'FBEditor.editor.command.pre.CreateCommand',
			'FBEditor.editor.command.pre.CreateRangeCommand',
			'FBEditor.editor.command.pre.DeleteWrapperCommand'
		],
		controllerClass: 'FBEditor.editor.element.pre.PreElementController',
		htmlTag: 'pre',
		xmlTag: 'pre',
		cls: 'el-pre',
		splittable: true,

		isPre: true,

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Блок предварительно отформатированного текста');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		}
	}
);