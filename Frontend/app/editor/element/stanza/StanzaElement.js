/**
 * Элемент stanza.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.stanza.StanzaElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.stanza.SplitCommand',
			'FBEditor.editor.command.stanza.CreateCommand',
			'FBEditor.editor.element.stanza.StanzaElementController'
		],
		controllerClass: 'FBEditor.editor.element.stanza.StanzaElementController',
		htmlTag: 'stanza',
		xmlTag: 'stanza',
		cls: 'el-stanza',
		permit: {
			splittable: true
		},

		createScaffold: function ()
		{
			var me = this,
				els = {};

			els.p = FBEditor.editor.Factory.createElement('p');
			els.t = FBEditor.editor.Factory.createElementText('Стих');
			els.p.add(els.t);
			me.add(els.p);

			return els;
		}
	}
);