/**
 * Элемент section.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.section.SectionElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.section.CreateCommand',
			'FBEditor.editor.command.section.SplitCommand',
			'FBEditor.editor.element.section.SectionElementController'
		],
		controllerClass: 'FBEditor.editor.element.section.SectionElementController',
		htmlTag: 'section',
		xmlTag: 'section',
		cls: 'el-section',
		permit: {
			splittable: true
		},
		statics: {
			num: 0
		},

		isSection: true,

		constructor: function ()
		{
			var me = this,
				num = me.self.num;

			num++;
			me.defaultAttributes = {
				id: 'section' + num
			};
			me.self.num = num;

			me.callParent(arguments);
		},

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.title = FBEditor.editor.Factory.createElement('title');
			els.pT = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Заголовок');
			els.pT.add(els.t);
			els.title.add(els.pT);
			me.add(els.title);
			els.p = FBEditor.editor.Factory.createElement('p');
			els.t2 = FBEditor.editor.Factory.createElementText('Текст');
			els.p.add(els.t2);
			me.add(els.p);

			return els;
		}
	}
);