/**
 * Элемент notes.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.notes.NotesElement',
	{
		extend: 'FBEditor.editor.element.AbstractElement',
		requires: [
			'FBEditor.editor.command.notes.CreateCommand',
			'FBEditor.editor.element.notes.NotesElementController'
		],
		controllerClass: 'FBEditor.editor.element.notes.NotesElementController',
		htmlTag: 'notes',
		xmlTag: 'notes',
		cls: 'el-notes',

		isNotes: true,

		createScaffold: function ()
		{
			var me = this,
				factory = FBEditor.editor.Factory,
				els = {};

			// заголовок
			els.title = factory.createElement('title');
			me.add(els.title);
			els.p = factory.createElement('p');
			els.title.add(els.p);
			els.t = factory.createElementText('Примечания');
			els.p.add(els.t);

			// сноска
			els.notebody = factory.createElement('notebody');
			els = Ext.apply(els, els.notebody.createScaffold());

			me.add(els.notebody);

			return els;
		}
	}
);