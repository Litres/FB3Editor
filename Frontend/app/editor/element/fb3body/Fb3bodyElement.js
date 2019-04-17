/**
 * Корневой элемент текста книги.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.element.fb3body.Fb3bodyElement',
	{
		extend: 'FBEditor.editor.element.root.RootElement',

		xmlTag: 'fb3-body',

		defaultAttributes: {
			'xmlns': 'http://www.fictionbook.org/FictionBook3/body',
			'xmlns:xlink': 'http://www.w3.org/1999/xlink'/*,
			'xmlns:fb3d': 'http://www.fictionbook.org/FictionBook3/description'*/
		},

		cls: 'el-body',

		/**
		 * @property {Boolean} Является ли элементом тела книги.
		 */
		isBody: true,

		constructor: function ()
		{
			var me = this,
				id;

			me.callParent(arguments);

			id = me.attributes.id;
			delete me.attributes.id;

			// генерируем новый uuid
			me.attributes.id = id || Ext.data.identifier.Uuid.Global.generate();
		},

		createScaffold: function ()
		{
			var me = this,
				els = {},
				factory = FBEditor.editor.Factory;

			els.title = factory.createElement('title');
			me.add(els.title);
			els.p = me.createP('Заголовок книги.');
			els.title.add(els.p);
			
			els.epigraph = me.createEpigraph('Эпиграф ко всей книге');
			me.add(els.epigraph);
			
			// глава 1
			
			els.section = me.createSection('Глава I');
			me.add(els.section);
			
			els.epigraph = me.createEpigraph('Эпиграф главы');
			els.section.add(els.epigraph);
			
			els.p = me.createP('Текст первой главы.');
			els.section.add(els.p);
			
			els.poem = factory.createElement('poem');
			els.section.add(els.poem);
			
			els.stanza = factory.createElement('stanza');
			els.poem.add(els.stanza);
			els.p = me.createP('Стихи стихи стихи');
			els.stanza.add(els.p);
			els.p = me.createP('Белые белые белые');
			els.stanza.add(els.p);
			
			els.stanza = factory.createElement('stanza');
			els.poem.add(els.stanza);
			els.p = me.createP();
			els.stanza.add(els.p);
			
			els.stanza = factory.createElement('stanza');
			els.poem.add(els.stanza);
			els.p = me.createP('Но на самом деле нет');
			els.stanza.add(els.p);
			els.p = me.createP('Не стихи (просто пример оформления стихов)');
			els.stanza.add(els.p);
			
			els.p = me.createP('Письмо, цитируем его:');
			els.section.add(els.p);
			
			els.bq = factory.createElement('blockquote');
			els.section.add(els.bq);
			els.p = me.createP('Текст цитаты, цитаты текст.');
			els.bq.add(els.p);
			els.p = me.createP('Еще текст цитаты еще цитаты текст.');
			els.bq.add(els.p);
			
			els.p = me.createP('Снова простой текст.');
			els.section.add(els.p);
			
			// глава 2
			
			els.section = me.createSection('Глава II');
			me.add(els.section);
			els.p = me.createP('Текст второй главы. ');
			els.section.add(els.p);
			els.strong = factory.createElement('strong');
			els.p.add(els.strong);
			els.strong.add(factory.createElementText('Жирный '));
			els.em = factory.createElement('em');
			els.p.add(els.em);
			els.em.add(factory.createElementText('курсив '));
			els.p.add(factory.createElementText('сноска'));
			els.note = factory.createElement('note', {href: 'note_1'});
			els.p.add(els.note);
			els.note.add(factory.createElementText('1'));
			els.p.add(factory.createElementText(' и вторая'));
			els.note = factory.createElement('note', {href: 'note_2'});
			els.p.add(els.note);
			els.note.add(factory.createElementText('2'));
			els.p.add(factory.createElementText(' сноска'));
			
			// примечания
			
			els.notes = factory.createElement('notes');
			me.add(els.notes);
			
			els.title = factory.createElement('title');
			els.notes.add(els.title);
			els.p = me.createP('Примечания');
			els.title.add(els.p);
			
			els.notebody = factory.createElement('notebody', {id: 'note_1'});
			els.notes.add(els.notebody);
			els.p = me.createP('Текст первой сноски');
			els.notebody.add(els.p);
			
			els.notebody = factory.createElement('notebody', {id: 'note_2'});
			els.notes.add(els.notebody);
			els.p = me.createP('Текст второй сноски');
			els.notebody.add(els.p);

			return els;
		},
		
		/**
		 * @private
		 * Создает абзац с текстом.
		 * Если текст не передан, то создается абзац с пустым элементом.
		 * @param {String} [text] Текст.
		 * @return {FBEditor.editor.element.p.PElement} Абзац.
		 */
		createP: function (text)
		{
			var factory = FBEditor.editor.Factory,
				p,
				t;
			
			p = factory.createElement('p');
			t = text ? factory.createElementText(text) : factory.createElement('br');
			p.add(t);
			
			return p;
		},
		
		/**
		 * @private
		 * Создает эпиграф.
		 * @param {String} text Текст.
		 * @return {FBEditor.editor.element.epigraph.EpigraphElement} Эпиграф.
		 */
		createEpigraph: function (text)
		{
			var me = this,
				factory = FBEditor.editor.Factory,
				epigraph,
				p;
			
			epigraph = factory.createElement('epigraph');
			p = me.createP(text);
			epigraph.add(p);
			
			return epigraph;
		},
		
		/**
		 * @private
		 * Создает главу с заголовком.
		 * @param {String} text Текст заголовка.
		 * @return {FBEditor.editor.element.section.SectionElement} Глава.
		 */
		createSection: function (text)
		{
			var me = this,
				factory = FBEditor.editor.Factory,
				section,
				title,
				p;
			
			section = factory.createElement('section');
			title = factory.createElement('title');
			p = me.createP(text);
			title.add(p);
			section.add(title);
			
			return section;
		}
	}
);