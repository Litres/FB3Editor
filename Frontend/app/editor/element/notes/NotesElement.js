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
				els = {};

			// заголовок
			els.title = FBEditor.editor.Factory.createElement('title');
			els = Ext.apply(els, els.title.createScaffold());
			me.add(els.title);

			// сноска
			els.notebody = FBEditor.editor.Factory.createElement('notebody');
			els = Ext.apply(els, els.notebody.createScaffold());

			me.add(els.notebody);

			return els;
		}
	}
);