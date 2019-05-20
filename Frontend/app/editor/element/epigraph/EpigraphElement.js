/**
 * Элемент epigraph.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.epigraph.EpigraphElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.epigraph.CreateCommand',
			'FBEditor.editor.element.epigraph.EpigraphElementController',
			'FBEditor.editor.command.epigraph.SplitCommand'
		],
		controllerClass: 'FBEditor.editor.element.epigraph.EpigraphElementController',
		htmlTag: 'epigraph',
		xmlTag: 'epigraph',
		cls: 'el-epigraph',
		splittable: true,

		isEpigraph: true,

		createScaffold: function ()
		{
			var me = this,
				factory = FBEditor.editor.Factory,
				els = {};

			els.p = factory.createElement('p');
			els.t = factory.createElementText('Эпиграф');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		}
	}
);