/**
 * Фабрика создания элементов для редактора текста.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.Factory',
	{
		singleton: 'true',
		requires: [
			'FBEditor.editor.element.a.AElement',
			'FBEditor.editor.element.annotation.AnnotationElement',
			'FBEditor.editor.element.b.BElement',
			'FBEditor.editor.element.blockquote.BlockquoteElement',
			'FBEditor.editor.element.body.BodyElement',
			'FBEditor.editor.element.br.BrElement',
			'FBEditor.editor.element.code.CodeElement',
			'FBEditor.editor.element.desc.annotation.AnnotationElement',
			'FBEditor.editor.element.desc.bibliodescription.BibliodescriptionElement',
			'FBEditor.editor.element.desc.history.HistoryElement',
			'FBEditor.editor.element.desc.preamble.PreambleElement',
			'FBEditor.editor.element.div.DivElement',
			'FBEditor.editor.element.em.EmElement',
			'FBEditor.editor.element.epigraph.EpigraphElement',
			'FBEditor.editor.element.fb3body.Fb3bodyElement',
			'FBEditor.editor.element.header.HeaderElement',
			'FBEditor.editor.element.i.IElement',
			'FBEditor.editor.element.img.ImgElement',
			'FBEditor.editor.element.li.LiElement',
			'FBEditor.editor.element.marker.MarkerElement',
			'FBEditor.editor.element.note.NoteElement',
			'FBEditor.editor.element.notebody.NotebodyElement',
			'FBEditor.editor.element.notes.NotesElement',
			'FBEditor.editor.element.ol.OlElement',
			'FBEditor.editor.element.p.PElement',
			'FBEditor.editor.element.poem.PoemElement',
			'FBEditor.editor.element.pre.PreElement',
			'FBEditor.editor.element.section.SectionElement',
			'FBEditor.editor.element.spacing.SpacingElement',
			'FBEditor.editor.element.span.SpanElement',
			'FBEditor.editor.element.stanza.StanzaElement',
			'FBEditor.editor.element.strikethrough.StrikethroughElement',
			'FBEditor.editor.element.strong.StrongElement',
			'FBEditor.editor.element.sub.SubElement',
			'FBEditor.editor.element.subscription.SubscriptionElement',
			'FBEditor.editor.element.subtitle.SubtitleElement',
			'FBEditor.editor.element.sup.SupElement',
			'FBEditor.editor.element.table.TableElement',
			'FBEditor.editor.element.td.TdElement',
			'FBEditor.editor.element.th.ThElement',
			'FBEditor.editor.element.title.TitleElement',
			'FBEditor.editor.element.tr.TrElement',
			'FBEditor.editor.element.ul.UlElement',
			'FBEditor.editor.element.text.TextElement',
			'FBEditor.editor.element.u.UElement',
			'FBEditor.editor.element.undefined.UndefinedElement',
			'FBEditor.editor.element.underline.UnderlineElement'
		],

		/**
		 * Создает новый элемент.
		 * @param {String} name Название элемента.
		 * @param {Object} [attributes] Атрибуты элемента.
		 * @param {FBEditor.editor.element.AbstractElement[]} [children] Дочерние элементы.
		 * @return {FBEditor.editor.element.AbstractElement} Элемент.
		 */
		createElement: function (name, attributes, children)
		{
			var n = name,
				lastPart,
				nameEl,
				el;

			if (Ext.isEmpty(n))
			{
				throw Error('Невозможно создать элемент. Передано пустое назавние элемента.');
			}

			// преобразуем имя в реальное

			n = n.toLowerCase();
			n = n.replace(/-([a-z])/g, '$1');

			if (/:/.test(n))
			{
				// учитываем пространство имен

				n = n.split(':');

				// корректируем последнюю часть имени
				lastPart = n.pop();
				lastPart = lastPart + '.' + Ext.String.capitalize(lastPart);
				n.push(lastPart);

				n = n.join('.');
			}
			else
			{
				// без пространства имен
				n = n +'.' + Ext.String.capitalize(n);
			}

			nameEl = 'FBEditor.editor.element.' + n + 'Element';

			try
			{
				attributes = attributes || {};
				children = children || [];
				el = Ext.create(nameEl, attributes, children);
			}
			catch (e)
			{
				el = Ext.create('FBEditor.editor.element.undefined.UndefinedElement', name, attributes, children);
				Ext.log(
					{
						level: 'warn',
						msg: 'Неопределенный элемент: ' + nameEl,
						dump: e
					}
				);
			}

			return el;
		},

		/**
		 * Создает текстовый элемент.
		 * @param {String} text Текст.
		 * @return {FBEditor.editor.element.TextElement} Текстовый элемент.
		 */
		createElementText: function (text)
		{
			var el;

			text = Ext.isString(text) ? text : '';

			try
			{
				el = Ext.create('FBEditor.editor.element.text.TextElement', text);
			}
			catch (e)
			{
				throw Error('Невозможно создать текстовый элемент: ' + text);
			}

			return el;
		}
	}
);