/**
 * Менеджер редактора.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.Manager',
	{
		requires: [
			'FBEditor.editor.CreateContent',
			'FBEditor.editor.Factory',
			'FBEditor.editor.History',
			'FBEditor.editor.Range',
			'FBEditor.editor.Revision',
			'FBEditor.editor.overlay.Overlay',
			'FBEditor.editor.schema.Schema',
			'FBEditor.editor.search.Search',
			'FBEditor.xsl.Editor'
		],

		/**
		 * @property {Boolean} Использовать ли ревизии.
		 */
		enableRevision: false,

		/**
		 * @property {Selection} Текущее выделение.
		 */
		selection: null,
		
		/**
		 * @property {FBEditor.editor.Range} Объект текущего выделения.
		 */
		range: null,

		/**
		 * @property {Boolean} Активна ли заморозка событий вставки узлов.
		 */
		suspendEvent: false,

		/**
		 * @property {Boolean} Идет ли процесс синхронизации кнопок.
		 */
		processSyncButtons: false,

		/**
		 * @property {String} Имя пустого элемента.
		 */
		emptyElement: 'br',

		/**
		 * @property {Boolean} true - Регулировать ли выделение по левой стороне, false - по правой, null -
		 * неопределено.
		 */
		selectionToLeft: null,

		/**
		 * @property {Boolean} true - Регулировать ли выделение по верхней стороне, false - по нижней, null -
		 * неопределено.
		 */
		selectionToUp: null,

		/**
		 * @protected
		 * @property {String} Xml тела книги.
		 */
		xml: null,

		/**
		 * @protected
		 * @property {Boolean} Отображаются ли непечатаемые символы в настоящий момент.
		 */
		unprintedSymbols: false,

		/**
		 * @private
		 * @property {FBEditor.editor.view.Editor} Редактор текста.
		 */
		editor: null,
		
		/**
		 * @private
		 * @property {FBEditor.editor.search.Search} Поиск по тексту.
		 */
		search: null,

		/**
		 * @private
		 * @property {FBEditor.editor.History} История редактора.
		 */
		history: null,

		/**
		 * @private
		 * @property {FBEditor.editor.Revision} Ревизия xml.
		 */
		revision: null,

		/**
		 * @private
		 * @property {FBEditor.editor.schema.Schema} Схема.
		 */
		schema: null,

		/**
		 * @private
		 * @property {FBEditor.editor.element.root.RootElement} Корневой элемент.
		 */
		content: null,

		/**
		 * @private
		 * @property {FBEditor.editor.element.AbstractElement} Текущий выделенный элемент в редакторе.
		 */
		focusElement: null,

		/**
		 * @property {Object} Хранит id развернутых узлов дерева навигации по тексту.
		 */
		stateExpandedNodesTree: {},

		/**
		 * @private
		 * @property {String} Кэш для синхронизации кнопок.
		 * Используется для защиты от многократной синхронизации кнопок.
		 */
		cashSyncBtn: null,
		
		/**
		 * @private
		 * @property {FBEditor.editor.overlay.Overlay[]} Текущие оверлеи в тексте.
		 */
		overlays: null,
		
		/**
		 * @private
		 * @property {String[]} xtype кнопок, с горячими клавишами.
		 */
		hotkeysButtons: null,

		/**
		 * @param {FBEditor.editor.view.Editor} editor Редактор текста.
		 */
		constructor: function (editor)
		{
			var me = this,
				rootElementName = editor.rootElementName;

			// связь с редактором
			me.editor = editor;

			// создаем историю
			me.history = Ext.create('FBEditor.editor.History');

			if (me.enableRevision)
			{
				// создаем ревизию
				me.revision = Ext.create('FBEditor.editor.Revision', me);
			}
			
			// создаем схему
			me.schema = Ext.create('FBEditor.editor.schema.Schema', rootElementName);
			
			// создаем поиск по тексту
			me.search = Ext.create('FBEditor.editor.search.Search', {manager: me});
			
			// список кнопок с горячими клавишами
			me.addHotkeysButton('panel-toolstab-button-find');
			me.addHotkeysButton('panel-toolstab-button-replace');
		},

		/**
		 * Создает контент из xml.
		 * @param {String} xml Исходный xml тела книги.
		 */
		createContent: function (xml)
		{
			var me = this,
				oldContent = me.content,
				content;

			try
			{
                // получаем модель
                content = me.getModelFromXml(xml);

                // сохраняем исходный xml
				me.setXml(xml);

                // обвновляем содержимое редактора текста
				me.updateContent(content);
            }
            catch (e)
			{
				me.content = oldContent;

				throw e;
			}
		},

        /**
		 * Устанавливает исходный xml.
         * @param {String} xml
         */
		setXml: function (xml)
		{
			this.xml = xml;
		},

        /**
		 * Обновляет содержимое текста.
         * @param {FBEditor.editor.element.AbstractElement} content Модель.
         */
		updateContent: function (content)
		{
            var me = this,
                editor;

            me.content = content;

            // сбрасываем все данные о фокусе в тексте
            me.resetFocus();

            // устанавливаем связь корневого элемента с редактором
            editor = me.getEditor();
            content.setEditor(editor);

            // сбрасываем историю редактора текста
            me.getHistory().clear();

            // загружаем контент в редактор
            editor.fireEvent('loadData');
		},

        /**
		 * Получает модель из xml.
         * @param {String} xml Исходный xml.
         * @return {FBEditor.editor.element.AbstractElement} Модель.
         */
		getModelFromXml: function (xml)
		{
            var me = this,
                transContent,
                content,
                creator,
                xsl,
                startTime = new Date().getTime();

			// экранируем слэш
			xml = xml.replace(/\\/g, "\\\\");

			// экранируем одинарную кавычку
			xml = xml.replace(/'/g, "\\'");

			// заменяем все br на пустые абзацы
			xml = xml.replace(/<br(.*?)\/>/gi, '<p><br$1/></p>');

			// пустые элементы должны иметь элемент br для возможности установки курсора
			xml = xml.replace(/<li><\/li>/gi, '<li><br/></li>');
			xml = xml.replace(/<subtitle><\/subtitle>/gi, '<subtitle><br/></subtitle>');

			// xsl-трансформация xml в промежуточную строку, которая затем будет преобразована в элемент
			xsl = FBEditor.xsl.Editor.getXsl();
			//console.log(xml);
			transContent = FBEditor.util.xml.Jsxml.trans(xml, xsl);
			//console.log(transContent);

			// нормализуем строку

			transContent = transContent.replace(/\n+|\t+/g, ' ');
			transContent = transContent.replace(/\), ?]/g, ')]');
			transContent = transContent.replace(/, $/, '');

			//console.log(transContent);
			//console.log('after transContent', new Date().getTime() - startTime);

			// преобразовываем строку в элемент
			creator = Ext.create('FBEditor.editor.CreateContent', transContent);

			//console.log('after CreateContent', new Date().getTime() - startTime);

			content = creator.getContent();
			//console.log('after fireEvent loadData', new Date().getTime() - startTime);

			return content;
		},

		/**
		 * Создает корневой элемент.
		 * @param {String} name Имя корневого элемента.
		 * @return {FBEditor.editor.element.AbstractElement} Корневой элемент.
		 */
		createRootElement: function (name)
		{
			var me = this,
				factory = me.getFactory(),
				root;

			root = factory.createElement(name);
			root.createScaffold();
			me.content = root;

			return root;
		},

		/**
		 * Устанавливает заморозку событий при вставке узлов.
		 * @param {Boolean} suspend true - ставит заморозку, false - убирает заморозку.
		 */
		setSuspendEvent: function (suspend)
		{
			this.suspendEvent = suspend;
		},

		/**
		 * Активна ли заморозка событий для вставки узлов.
		 * @return {Boolean}
		 */
		isSuspendEvent: function ()
		{
			return this.suspendEvent;
		},

		/**
		 * Активен ли режим отображения непечатаемых символов.
		 * @return {Boolean}
		 */
		isUnprintedSymbols: function ()
		{
			return this.unprintedSymbols;
		},

		/**
		 * Возвращает контент.
		 * @return {FBEditor.editor.element.AbstractElement} Корневой элемент тела книги.
		 */
		getContent: function ()
		{
			return this.content;
		},

		/**
		 * Возвращает фабрику элементов.
		 * @return {FBEditor.editor.Factory} Фабрика.
		 */
		getFactory: function ()
		{
			return FBEditor.editor.Factory;
		},

		/**
		 * Возвращает редактор текста.
		 * @return {FBEditor.editor.view.Editor}
		 */
		getEditor: function ()
		{
			return this.editor;
		},

		/**
		 * Возвращает историю.
		 * @return {FBEditor.editor.History}
		 */
		getHistory: function ()
		{
			return this.history;
		},

		/**
		 * Возвращает ревизию.
		 * @return {FBEditor.editor.Revision}
		 */
		getRevision: function ()
		{
			return this.revision;
		},
		
		/**
		 * Возвращает поиск по тексту.
		 * @return {FBEditor.editor.search.Search}
		 */
		getSearch: function ()
		{
			return this.search;
		},

		/**
		 * Возвращает html тела книги.
		 * @return {Node}
		 */
		getNode: function (viewportId)
		{
			var me = this,
				content = me.content,
				node;

			me.suspendEvent = true;
			node = content.getNode(viewportId);
			me.suspendEvent = false;

			return node;
		},

		/**
		 * Возвращает xml тела книги.
		 * @return {String} Строка xml.
		 */
		getXml: function (withoutText, withoutFormat)
		{
			var me = this,
				content = me.content,
				xml;

			//console.log('content', content);
			xml = content.getXml(withoutText, withoutFormat);
			xml = '<?xml version="1.0" encoding="UTF-8"?>' + xml;
			//console.log(xml);

			return xml;
		},

		/**
		 * Возвращает xml выделенного фрагмента.
		 * @return {String} Строка xml.
		 */
		getRangeXml: function ()
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				nodes = {},
				pos = {},
				xml = '',
				helper,
				offset,
				viewportId,
				range;

			// получаем данные из выделения
			range = sel.getRangeAt(0);

			if (range.collapsed)
			{
				// отсутствует выделение
				return '';
			}

			nodes.common = range.commonAncestorContainer;
			els.common = nodes.common.getElement();
			els.start = range.startContainer.getElement();
			els.end = range.endContainer.getElement();
			els.p = els.common.getStyleHolder();

			viewportId = nodes.common.viewportId;

			if (els.start.equal(els.common) && els.end.equal(els.common) && !els.common.isText)
			{
				// некорректное выделение
				return '';
			}

			offset = {
				start: range.startOffset,
				end: range.endOffset
			};

			//console.log('els', els);

			me.setSuspendEvent(true);

			if (els.common.isText)
			{
				// получаем выделенный текст
				xml = els.common.getText(offset.start, offset.end);
			}
			else if (els.p)
			{
				els.common = els.p;
				helper = els.common.getNodeHelper();
				nodes.common = helper.getNode(viewportId);

				// необходимо ли переместить указатель для последнего выделенного элемента
				els.needPrevEnd = els.end.isText && offset.end < els.end.getLength();

				// разбиваем конечный узел текущего выделения
				nodes.container = range.endContainer;
				nodes.end = me.splitNode(els, nodes, offset.end);

				// разбиваем начальный узел текущего выделения
				nodes.container = range.startContainer;
				nodes.start = me.splitNode(els, nodes, offset.start);
				els.start = nodes.start.getElement();
				els.prev = els.start.prev();

				nodes.end = els.needPrevEnd ? nodes.end.previousSibling : nodes.end;
				els.end = nodes.end.getElement();

				if (els.end.isEmpty())
				{
					// удаляем пустой конечный узел
					nodes.prev = nodes.end.previousSibling;
					els.common.remove(els.end, viewportId);
					nodes.end = nodes.prev;
					els.end = nodes.end.getElement();
				}

				if (els.prev && els.prev.isEmpty())
				{
					// удаляем пустой начальный узел
					els.common.remove(els.prev, viewportId);
				}

				els.next = els.start;

				while (els.next && !els.next.equal(els.end))
				{
					xml += els.next.getXml();
					els.next = els.next.next();
				}

				xml += els.end.getXml();

				// объединяем узлы

				if (nodes.end.nextSibling)
				{
					me.joinNode(nodes.end.nextSibling);

				}

				if (els.prev)
				{
					me.joinNode(nodes.start);
				}

				// удаляем пустые элементы
				me.removeEmptyNodes(nodes.common);

				// восстанавливаем выделение
				me.setCursor(
					{
						withoutSyncButtons: true,
						startNode: me.getDeepFirst(range.startContainer),
						startOffset: offset.start,
						endNode: me.getDeepLast(range.endContainer),
						endOffset: offset.end
					}
				);
			}
			else 
			{
				// первый элемент

				els.first = els.start;

				while (els.first && !els.first.parent.equal(els.common))
				{
					els.first = els.isRoot ? els.first.first() : els.first.parent;
				}

				// последний элемент

				els.last = els.end;

				while (els.last && !els.last.parent.equal(els.common))
				{
					els.last = els.isRoot ? els.last.last() : els.last.parent;
				}

				// позиция выделения относительно затронутых элементов
				pos.isStart = els.first.isStartRange(range);
				pos.isEnd = els.last.isEndRange(range);

				if (!pos.isStart)
				{
					// разбиваем первый элемент
					nodes.container = range.startContainer;
					nodes.start = me.splitNode(els, nodes, offset.start);
					els.start = nodes.start.getElement();
				}
				else
				{
					els.start = els.first;
				}

				if (!pos.isEnd)
				{
					// разбиваем последний элемент
					nodes.container = range.endContainer;
					nodes.end = me.splitNode(els, nodes, offset.end);
					els.end = nodes.end.previousSibling.getElement();
				}
				else
				{
					els.end = els.last;
				}

				els.next = els.start;

				while (els.next && !els.next.equal(els.end))
				{
					xml += els.next.getXml();
					els.next = els.next.next();
				}

				xml += els.next.getXml();

				// воединяем разбитые узлы обратно

				if (!pos.isStart)
				{
					// соединяем первый элемент
					nodes.prev = nodes.start.previousSibling;
					me.joinNode(nodes.start);

					// удаляем пустые элементы
					me.removeEmptyNodes(nodes.prev);
				}

				if (!pos.isEnd)
				{
					// соединяем последний элемент

					nodes.next = nodes.end.nextSibling || nodes.end;
					me.joinNode(nodes.next);

					// удаляем пустые элементы
					me.removeEmptyNodes(nodes.end);
				}

				// восстанавливаем выделение
				me.setCursor(
					{
						withoutSyncButtons: true,
						startNode: range.startContainer,
						startOffset: offset.start,
						endNode: range.endContainer,
						endOffset: offset.end
					}
				);
			}

			me.setSuspendEvent(false);

			//console.log('getRangeXml', xml);
			
			return xml;
		},

		/**
		 * Устанавливает текущий выделенный элемент в редакторе.
		 * @param {Node} node Узел.
		 * @param {Selection} [sel]
		 * @param {Boolean} [withoutSyncButtons] Без синхронизации кнопок.
		 */
		setFocusElement: function (node, sel, withoutSyncButtons)
		{
			var me = this,
				panelProps = me.getPanelProps(),
				el,
				range,
				newRange,
				difCollapsed;

			el = node.getElement ? node.getElement() : null;

			if (el)
			{
                // сохраняем глобальную ссылку на активный менеджер
                FBEditor.setEditorManager(me);

                if (panelProps)
                {
                    // обновляем информацию о выделенном элементе в панели свойств
                    panelProps.fireEvent('loadData', el);
                }

				me.focusElement = el;
				me.selection = sel || window.getSelection();
				range = me.selection.rangeCount ? me.selection.getRangeAt(0) : null;
				
				//console.log('setFocusElement', range, el);

                if (range)
				{
					difCollapsed = me.range ? me.range.collapsed !== range.collapsed : true;
					
					newRange = {
						collapsed: range.collapsed,
						common: range.commonAncestorContainer,
						start: range.startContainer,
						end: range.endContainer,
						offset: {
							start: range.startOffset,
							end: range.endOffset
						},
						toString: function ()
						{
							return range.toString();
						}
					};
					
					me.setRange(newRange);
				}
				else
				{
					difCollapsed = true;
					
					newRange = {
						collapsed: true,
						common: node,
						start: node,
						end: node,
						offset: {
							start: 0,
							end: 0
						},
						toString: function ()
						{
							return '';
						}
					};
					
					me.setRange(newRange);
				}

				if (!el.isText && me.cashSyncBtn !== el.elementId || difCollapsed)
				{
					// синхронизируем кнопки элементов с текущим выделением
					// защита от многократной синхронизации на одном и том же элементе
					me.cashSyncBtn = el.elementId;

					if (!withoutSyncButtons)
					{
						me.syncButtons();
					}
				}
			}
		},

		/**
		 * Устанавливает режим отображения непечатаемых символов.
		 * @param {Boolean} show Отображать ли.
		 */
		setUnprintedSymbols: function (show)
		{
			var me = this,
				content = me.getContent();
			
			if (me.unprintedSymbols !== show)
			{
				me.unprintedSymbols = show;
				
				// обновляем непечатаемые символы в отображении
				me.setSuspendEvent(true);
				content.updateUnprintedSymbols();
				me.setSuspendEvent(false);
			}
		},

		/**
		 * Возвращает панель свойств элемента для текущего контента.
		 * @return {Ext.panel.Panel}
		 */
		getPanelProps: function ()
		{
			return null;
		},

		/**
		 * Сбрасывает данные фокуса.
		 */
		resetFocus: function ()
		{
			var me = this;

			me.focusElement = null;
			me.range = null;
			me.selection = null;
			me.selectionToLeft = null;
			me.selectionToUp = null;
		},

		/**
		 * Устанавливает выделение.
		 * @param data Данные выделения.
		 * @param {Node} data.startNode Начальный узел.
		 * @param {Number} [data.startOffset] Начальное смещение.
		 * @param {Node} [data.endNode] Конечный узел.
		 * @param {Number} [data.endOffset] Конечное смещение.
		 * @param {Boolean} [data.withoutSyncButtons] Без синхронизации кнопок.
		 * @param {FBEditor.editor.element.AbstractElement} [data.focusElement] Фокусный элемент.
		 */
		setCursor: function (data)
		{
			var me = this,
				root = me.getContent(),
				sel = window.getSelection(),
				helper,
				viewportId;
			
			try
			{
				data.focusElement = data.focusElement || data.startNode.getElement();
				data.startOffset = data.startOffset || 0;
				data.startOffset = data.startOffset > data.startNode.length ?
				                   data.startNode.length : data.startOffset;

				// устанавливаем фокус браузера в окно текста
				viewportId = data.startNode.viewportId;
				helper = root.getNodeHelper();
				//helper.getNode(viewportId).focus();

				// перематываем скролл
				/*
				if (data.focusElement.nodes[viewportId].scrollIntoView)
				{
					//TODO сделать прокрутку только, если элемент не виден, иначе прокрутка не требуется
					data.focusElement.nodes[viewportId].scrollIntoView();
				}
				*/

				// выделение

				if (data.focusElement.isText)
				{
					sel.collapse(data.startNode, data.startOffset);
				}
				else
				{
					sel.collapse(data.startNode, 0);
				}

				if (data.endNode)
				{
					data.endOffset = data.endOffset || 0;
					sel.extend(data.endNode, data.endOffset);
				}
				
				//console.log('set cur', sel);
				
				// сохраняем фокусный элемент и ставим фокус
				helper = data.focusElement.getNodeHelper();
				me.setFocusElement(helper.getNode(viewportId), sel, data.withoutSyncButtons);
			}
			catch (e)
			{
				console.log('Ошибка установки курсора', e, data);
			}
		},

		/**
		 * Восстанавливает позицию курсора, если есть такая возможность.
		 */
		restoreCursor: function ()
		{
			var me = this,
				range = me.getRange();

			if (range && range.collapsed)
			{
				me.setCursor(
					{
						withoutSyncButtons: true,
						startNode: range.start,
						startOffset: range.offset.start
					}
				);
			}
		},

		/**
		 * Восстанавливает выделение, если есть такая возможность.
		 */
		restoreSelection: function ()
		{
			var me = this,
				range = me.getRange();

			if (range)
			{
				me.setCursor(
					{
						withoutSyncButtons: true,
						startNode: range.start,
						startOffset: range.offset.start,
						endNode: range.end,
						endOffset: range.offset.end
					}
				);
			}
		},

		/**
		 * Возвращает текущий выделенный элемент в редакторе.
		 * @return {FBEditor.editor.element.AbstractElement}
		 */
		getFocusElement: function ()
		{
			return this.focusElement;
		},

		/**
		 * Очищает куэш синхронизированной кнопки.
		 */
		clearCacheSyncButton: function ()
		{
			this.cashSyncBtn = null;
		},

		/**
		 * Доступна ли синхронизация кнопок.
		 * @return {Boolean}
		 */
		availableSyncButtons: function ()
		{
			return true;
		},

		/**
		 * Синхронизирует кнопки элементов с текущим выделением.
		 */
		syncButtons: function ()
		{
			var me = this,
				editor = me.getEditor();

			console.log('sync');

			// синхронизируем кнопки на тулбаре
			editor.syncButtons();
		},

		/**
		 * Деактиврует кнопки элементов
		 */
		disableButtons: function ()
		{
			var me = this,
				editor = me.getEditor(),
				toolbar;

			toolbar = editor.getToolbar();

			if (toolbar)
			{
				toolbar.fireEvent('disableButtons');
			}
		},
		
		/**
		 * Добавляет кнопку в список для горячих клавиш.
		 * @param {String} xtype Кнопка, которая доступная через горячие клавиши.
		 */
		addHotkeysButton: function (xtype)
		{
			var me = this;
			
			me.hotkeysButtons = me.hotkeysButtons || [];
			me.hotkeysButtons.push(xtype);
		},
		
		/**
		 * Возвращает список кнопок, доступных через горячие клавиши.
		 * @return {String[]}
		 */
		getHotkeysButtons: function ()
		{
			return this.hotkeysButtons;
		},

        /**
		 * Проверяет нажатие горячих клавиш.
         * @param {KeyboardEvent} e Событие нажатия клавиши.
         */
        checkHotkeys: function (e)
		{
			var me = this,
                hotkeysManager = FBEditor.hotkeys.Manager,
				hotkeysButtons,
				keyName,
				data,
				evt,
                numberSlot,
                editor,
                toolbar;

			// обертка события
			evt = Ext.create('Ext.event.Event', e);

            keyName = evt.getKeyName();

            //console.log('checkHotkeys', evt.isSpecialKey(), evt.getKeyName());

			if ((!evt.isSpecialKey() || keyName === 'ENTER') && (evt.ctrlKey || evt.shiftKey || evt.altKey))
			{
				data = {
					key: e.key.toUpperCase(),
					ctrl: evt.ctrlKey,
					shift: evt.shiftKey,
					alt: evt.altKey
				};

                // получаем слот, связанный с горячими клавишами
                numberSlot = hotkeysManager.getNumberSlot(data);

                //console.log('numberSlot', numberSlot, data);

                if (numberSlot)
                {
                    e.preventDefault();
                    
                    // тулбар с кнопками редактирования текста
                    editor = me.getEditor();
                    toolbar = editor.getToolbar();

                    // выполняем клик по кнопке, привязанной к соответствующему слоту горячих клавиш
                    toolbar.callClickButton(numberSlot);
                    
                    // другие кнопки, которые привязаны к горячим клавишам
                    hotkeysButtons = me.getHotkeysButtons();
                    
                    Ext.each(
	                    hotkeysButtons,
	                    function (xtype)
	                    {
	                    	var btn,
			                    query;
	                    	
	                    	// получаем кнопку, привязанную к соответствующему слоту горячих клавиш
		                    query = xtype + '[numberSlot=' + numberSlot + ']';
		                    btn = Ext.ComponentQuery.query(query);
		                    btn = btn ? btn[0] : null;
		                    
		                    if (btn)
		                    {
		                    	if (!btn.disabled)
			                    {
				                    if (btn.enableToggle)
				                    {
					                    btn.toggle();
				                    }
				
				                    // выполняем клик по кнопке
				                    btn.fireEvent('click');
			                    }
			
			                    // прерываем цикл
			                    return false;
		                    }
	                    }
                    );
                }
                else if (keyName === 'ENTER')
				{
					// предотвращаем изменение стурктуры
                    e.preventDefault();
				}
			}
		},

		/**
		 * Удаляет все ссылки на узлы для конкретного окна.
		 * @param {String} viewportId Id окна.
		 */
		removeNodes: function (viewportId)
		{
			var me = this,
				rootEl = me.content;

			rootEl.removeNodes(viewportId);
		},

		/**
		 * Создает новый элемент в теле книги.
		 * @param {String} name Имя элемента.
		 * @param {Object} [opts] Дополнительные данные.
		 */
		createElement: function (name, opts)
		{
			var me = this,
				factory = me.getFactory(),
				el,
				sel;

			sel = me.getSelection();
			el = factory.createElement(name);
			//console.log(name, opts);
			el.fireEvent('createElement', sel, opts);
		},

		/**
		 * Удаляет элемент, сохраняя всех потомков элемента на его месте.
		 * @param {String} name Имя элемента.
		 * @param {Object} [opts] Дополнительные данные.
		 */
		deleteWrapper: function (name, opts)
		{
			var me = this,
				options = opts,
				cmd;

			options = options || {};
			options.manager = me;
			cmd = Ext.create('FBEditor.editor.command.' + name + '.DeleteWrapperCommand', {opts: options});

			if (cmd.execute())
			{
				me.getHistory().add(cmd);
			}
		},

		/**
		 * Устанавливает редактируемость корневого элемента.
		 * @param {Boolean} editable Разрешить ле редактируемость.
		 * @param {String} viewportId Айди окна.
		 */
		setRootContentEditable: function (editable, viewportId)
		{
			var me = this,
				root = me.getContent(),
				helper,
				node;

			helper = root.getNodeHelper();
			node = helper.getNode(viewportId);
			node.setAttribute('contenteditable', Boolean(editable));
		},

		/**
		 * Возвращает текущее выделение в теле книги.
		 * @return {Selection} Текущее выделение в теле книги.
		 */
		getSelection: function ()
		{
			return this.selection;
		},

		/**
		 * Возвращает сохраненные данные выделения в теле книги.
		 * @return {FBEditor.editor.Range}
		 */
		getRange: function ()
		{
			return this.range;
		},
		
		/**
		 * Возвращает данные текущего выделения в теле книги, с учетом оверлея в тексте.
		 * @return {FBEditor.editor.Range}
		 */
		getRangeCursor: function ()
		{
			var me = this,
				sel = window.getSelection(),
				range = null,
				curRange;
			
			curRange = sel.rangeCount ? sel.getRangeAt(0) : null;
			
			if (curRange && curRange.startContainer.getElement)
			{
				range = {
					collapsed: curRange.collapsed,
					common: curRange.commonAncestorContainer,
					start: curRange.startContainer,
					end: curRange.endContainer,
					offset: {
						start: curRange.startOffset,
						end: curRange.endOffset
					},
					toString: function ()
					{
						return curRange.toString();
					}
				};
				
				range = me.range = Ext.create('FBEditor.editor.Range', range);
			}
			
			return range;
		},
		
		/**
		 * Сохраняет данные текущего выделения.
		 * @param {Object} range
		 * @param {Boolean} range.collapsed
		 * @param {Node} range.common
		 * @param {Node} range.start
		 * @param {Node} range.end
		 * @param {Object} range.offset
		 * @param {Number} range.offset.start
		 * @param {Number} range.offset.end
		 * @param {Function} range.toString
		 */
		setRange: function (range)
		{
			var me = this;
			
			// создаем новый объект выделения
			me.range = range ? Ext.create('FBEditor.editor.Range', range) : null;
		},

		/**
		 * Возвращает правила проверки элементов.
		 * @return {FBEditor.editor.schema.Schema}
		 */
		getSchema: function ()
		{
			return this.schema;
		},

		/**
		 * Возвращает элемент по его id.
		 * @param {Number} id Id элемента.
		 * @param {FBEditor.editor.element.AbstractElement} [el] Элемент относительно которого происходит поиск,
		 * по умолчанию - это корневой элемент.
		 * @return {FBEditor.editor.element.AbstractElement} Элемент.
		 */
		getElementById: function (id, el)
		{
			var me = this,
				res = null;

			el = el || me.getContent();
			if (el.elementId === id)
			{
				return el;
			}
			Ext.Array.each(
				el.children,
				function (item)
				{
					res = me.getElementById(id, item);
					if (res)
					{
						return false;
					}
				}
			);

			return res;
		},

		/**
		 * Возвращает список имен дочерних элементов.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 * @return {Array} Имена дочерних элементов.
		 */
		getNamesElements: function (el)
		{
			var els = [];

			Ext.Array.each(
				el.children,
			    function (item)
			    {
				    if (!item.isText)
				    {
					    els.push(item.getName());
				    }
			    }
			);

			return els;
		},

		/**
		 * Проверяет по схеме элемент.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 * @param {Boolean} [debug] Нужны ли отладочные сообщения.
		 */
		/*verifyElement: function (el, debug)
		{
			var me = this,
				sch = me.getSchema(),
				xml;

			if (!el || el.isText || el.isUndefined || el.isStyleHolder && el.isEmpty())
			{
				// текст, пустые абзаци и неопределенные элементы не нуждаются в проверке
				return true;
			}

			// получаем xml без текстовых элементов
			xml = me.content.getXml(true);

			// вызываем проверку по схеме
			sch.validXml({xml: xml, callback: me.verifyResult, scope: me, debug: debug});
		},*/

		/**
		 * Возвращает пустой элемент, для заполнения элементов без содержимого.
		 * @return {FBEditor.editor.element.AbstractElement} Пустой элемент.
		 */
		createEmptyElement: function ()
		{
			var me= this,
				el;

			el = me.getFactory().createElement(me.emptyElement);

			return el;
		},

		/**
		 * Создает пустой параграф, для заполнения элементов без содержимого.
		 * @return {FBEditor.editor.element.AbstractElement} Пустой элемент.
		 */
		createEmptyP: function ()
		{
			var me= this,
				els = {},
				factory = me.getFactory();

			els.empty = factory.createElement(me.emptyElement);
			els.p = factory.createElement('p');
			els.p.add(els.empty);

			return els.p;
		},

		/**
		 * Разбивает узел на два.
		 * @param els Элементы.
		 * @param els.common Верхний родительский элемент,
		 * отсносительно которого происходит разбивка текущего узла.
		 * @param nodes Узлы.
		 * @param nodes.container Текущий узел, который необходимо разделить.
		 * @param {Number} offset Смещение курсора относительно текущего узла.
		 * @return {Node} Новый узел, получившийся в результате разбивки.
		 */
		splitNode: function (els, nodes, offset)
		{
			var me = this,
				factory = me.getFactory(),
				viewportId;

			nodes.parentContainer = nodes.container.parentNode;
			viewportId = nodes.parentContainer.viewportId;
			els.parentContainer = nodes.parentContainer.getElement();
			els.container = nodes.container.getElement();

			if (els.parentContainer.equal(els.common) && els.container.isText)
			{
				// простая разбивка текстового узла на два
				nodes.next = nodes.container.nextSibling;

				// части текста
				els.endTextValue = nodes.container.nodeValue.substring(offset);
				els.startTextValue = nodes.container.nodeValue.substring(0, offset);

				if (els.startTextValue)
				{
					// изменяем текст текущего узла
					nodes.container.nodeValue = els.startTextValue;
					els.container.setText(els.startTextValue);
				}

				if (els.startTextValue && els.endTextValue.trim())
				{
					// добавляем текст после текущего узла
					els.container = factory.createElementText(els.endTextValue);
					nodes.container = els.container.getNode(viewportId);

					if (nodes.next)
					{
						els.next = nodes.next.getElement();
						els.parentContainer.insertBefore(els.container, els.next);
						nodes.parentContainer.insertBefore(nodes.container, nodes.next);
					}
					else
					{
						els.parentContainer.add(els.container);
						nodes.parentContainer.appendChild(nodes.container);
					}
				}
			}
			else
			{
				while (!els.parentContainer.equal(els.common))
				{
					nodes.next = nodes.parentContainer.nextSibling;
					nodes.parent = nodes.parentContainer.parentNode;
					els.parent = nodes.parent.getElement();
					nodes.nextContainer = nodes.container.nextSibling;

					// клонируем узел
					els.cloneContainer = els.parentContainer.clone({ignoredDeep: true});

					if (els.container.isText)
					{
						// часть текста после курсора
						els.endTextValue = nodes.container.nodeValue.substring(offset);

						// часть текста перед курсором
						els.startTextValue = nodes.container.nodeValue.substring(0, offset);

						if (!els.startTextValue)
						{
							// удаляем пустой текущий узел
							els.parentContainer.remove(els.container);
							nodes.parentContainer.removeChild(nodes.container);
						}
						else
						{
							// изменяем текст текущего узла
							nodes.container.nodeValue = els.startTextValue;
							els.container.setText(els.startTextValue);
						}

						if (els.endTextValue/*els.endTextValue.trim()*/)
						{
							// добавляем текст
							els.t = factory.createElementText(els.endTextValue);
							els.cloneContainer.add(els.t);
						}

						nodes.cloneContainer = els.cloneContainer.getNode(viewportId);

						if (nodes.next)
						{
							els.next = nodes.next.getElement();
							els.parent.insertBefore(els.cloneContainer, els.next);
							nodes.parent.insertBefore(nodes.cloneContainer, nodes.next);
						}
						else
						{
							els.parent.add(els.cloneContainer);
							nodes.parent.appendChild(nodes.cloneContainer);
						}
					}
					else
					{
						nodes.cloneContainer = els.cloneContainer.getNode(viewportId);

						if (nodes.next)
						{
							els.next = nodes.next.getElement();
							els.parent.insertBefore(els.cloneContainer, els.next);
							nodes.parent.insertBefore(nodes.cloneContainer, nodes.next);
						}
						else
						{
							els.parent.add(els.cloneContainer);
							nodes.parent.appendChild(nodes.cloneContainer);
						}

						if (nodes.container.firstChild)
						{
							// если элемент не пустой, то переносим его в клонированный элемент
							els.cloneContainer.add(els.container);
							nodes.cloneContainer.appendChild(nodes.container);
						}
						else
						{
							// или просто удаляем
							nodes.parentContainer.removeChild(nodes.container);
						}
						els.parentContainer.remove(els.container);
					}

					// переносим все узлы после курсора
					nodes.parent = nodes.cloneContainer;
					els.parent = nodes.parent.getElement();
					while (nodes.nextContainer)
					{
						els.nextContainer = nodes.nextContainer.getElement();
						nodes.buf = nodes.nextContainer.nextSibling;

						els.parent.add(els.nextContainer);
						nodes.parent.appendChild(nodes.nextContainer);
						els.parentContainer.remove(els.nextContainer);

						nodes.nextContainer = nodes.buf;
					}

					// переносим указатель
					nodes.container = nodes.cloneContainer;
					els.container = nodes.container.getElement();

					if (!nodes.parentContainer.firstChild)
					{
						// удаляем пустой контейнер
						nodes.parentContainer.parentNode.getElement().remove(els.parentContainer);
						nodes.parentContainer.parentNode.removeChild(nodes.parentContainer);
					}

					nodes.parentContainer = nodes.container.parentNode;
					els.parentContainer = nodes.parentContainer.getElement();
				}
			}

			return nodes.container;
		},

		/**
		 * Соединяет переданный узел с предыдущим узлом.
		 * @param {Node} node Узел, который необходимо объединить с предыдущим.
		 */
		joinNode: function (node)
		{
			var me = this,
				nodes = {},
				els = {},
				viewportId = node.viewportId;

			nodes.node = node;
			els.node = node.getElement();
			nodes.prev = node.previousSibling;
			els.prev = nodes.prev.getElement();

			if (els.node.isText && els.prev.isText)
			{
				// соединяем текстовые узлы
				els.text = els.prev.getText() + els.node.getText();
				els.prev.setText(els.text, viewportId);
				//nodes.prev.nodeValue = els.text;
			}
			else
			{
				// переносим все элементы в предыдущий узел

				nodes.first = nodes.node.firstChild;
				els.first = nodes.first ? nodes.first.getElement() : null;
				nodes.prevLast = nodes.prev;
				els.prevLast = els.prev;
				nodes.last = nodes.prevLast.lastChild;
				els.last = nodes.last ? nodes.last.getElement() : null;

				//console.log('join nodes, els', nodes, els);

				while (els.first && els.last)
				{
					nodes.firstChild = nodes.first.firstChild;
					nodes.next = nodes.first;
					//console.log('nodes.first, nodes.last, nodes.prevLast', nodes.first,
					// nodes.first.childNodes.length, nodes.last, nodes.prevLast);

					if (els.last.isText && !els.first.isText)
					{
						// перенос узлов без возможности объединения текста
						while (nodes.next)
						{
							//console.log('(1) nodes.next, nodes.last', nodes.next, nodes.last);
							nodes.buf = nodes.next.nextSibling;
							els.next = nodes.next.getElement();

							// переносим узел
							els.prevLast.add(els.next);
							nodes.next.parentNode.getElement().remove(els.next);
							nodes.prevLast.appendChild(nodes.next);

							nodes.next = nodes.buf;
						}
					}
					else
					{
						// перенос узлов с возможностью объединения текста
						while (nodes.next)
						{
							//console.log('(2) nodes.next, nodes.last', nodes.next, nodes.last);
							nodes.buf = nodes.next.nextSibling;
							els.next = nodes.next.getElement();

							if (els.last && els.last.isText && els.next.isText)
							{
								// объединяем текстовые узлы
								//els.nodeValue = nodes.last.nodeValue + nodes.next.nodeValue;
								//nodes.last.nodeValue = els.nodeValue;
								els.nodeValue = els.last.getText() + els.next.getText();
								els.last.setText(els.nodeValue, viewportId);
							}
							else
							{
								// переносим узел
								els.prevLast.add(els.next);
								//nodes.next.parentNode.getElement().remove(els.next);
								nodes.prevLast.appendChild(nodes.next);

								if (els.last.isText)
								{
									nodes.last = nodes.prevLast.lastChild;
									els.last = nodes.last ? nodes.last.getElement() : null;
								}
							}
							nodes.next = nodes.buf;
						}

						if (els.last.isText)
						{
							// удаляем узел
							nodes.first.parentNode.getElement().remove(els.first);
							nodes.first.parentNode.removeChild(nodes.first);
						}
					}

					if (nodes.prevLast.firstChild.getElement().isEmpty())
					{
						// удаляем пустой узел
						els.prevLast.remove(nodes.prevLast.firstChild.getElement());
						nodes.prevLast.removeChild(nodes.prevLast.firstChild);
					}

					nodes.first = nodes.firstChild;
					els.first = nodes.first ? nodes.first.getElement() : null;
					nodes.prevLast = nodes.last;
					els.prevLast = els.last;
					nodes.last = nodes.prevLast.lastChild;
					els.last = nodes.last ? nodes.last.getElement() : null;
				}
			}

			// удаляем узел
			nodes.node.parentNode.getElement().remove(els.node);
			nodes.node.parentNode.removeChild(nodes.node);
		},

		/**
		 * Является ли первым узел node, относителя предка common.
		 * @param {Node} common Предок относительно которого происходит определение.
		 * @param {Node} node Определяемый узел.
		 * @return {Boolean} Первый ли узел.
		 */
		isFirstNode: function (common, node)
		{
			var nodes = {},
				els = {};

			els.common = common.getElement();
			nodes.node = node;
			els.node = nodes.node.getElement();
			//console.log('common, nodes', common, nodes);
			do
			{
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.parentParent = nodes.parent.parentNode;
				els.parentParent = nodes.parentParent.getElement();
				nodes.first = nodes.parent.firstChild;
				els.first = nodes.first.getElement();
				//console.log('first, parent, parentParent', nodes.first, nodes.parent, nodes.parentParent,
				// [els.first.elementId, els.node.elementId]);

				if (els.first.elementId !== els.node.elementId)
				{
					// узел не является первым потомком
					return false;
				}

				nodes.node = nodes.parent;
				els.node = nodes.node.getElement();
			}
			while (els.parentParent.elementId !== els.common.elementId && els.parent.elementId !== els.common.elementId && !els.parentParent.isRoot);

			return true;
		},

		/**
		 * Является ли последним узел node, относителя предка common.
		 * @param {Node} common Предок относительно которого происходит определение.
		 * @param {Node} node Определяемый узел.
		 * @return {Boolean} Последний ли узел.
		 */
		isLastNode: function (common, node)
		{
			var nodes = {},
				els = {};

			els.common = common.getElement();
			nodes.node = node;
			els.node = nodes.node.getElement();
			//console.log('common, nodes', common, nodes);
			do
			{
				nodes.parent = nodes.node.parentNode;
				els.parent = nodes.parent.getElement();
				nodes.parentParent = nodes.parent.parentNode;
				els.parentParent = nodes.parentParent.getElement();
				nodes.last = nodes.parent.lastChild;
				els.last = nodes.last.getElement();
				//console.log('last, parent, parentParent', nodes.last, nodes.parent, nodes.parentParent,
				// [els.last.elementId, els.node.elementId]);

				if (els.last.elementId !== els.node.elementId)
				{
					// узел не является последним
					return false;
				}

				nodes.node = nodes.parent;
				els.node = nodes.node.getElement();
			}
			while (els.parentParent.elementId !== els.common.elementId && els.parent.elementId !== els.common.elementId && !els.parentParent.isRoot);

			return true;
		},

		/**
		 * Рекурсивно возвращает список параграфов начиная с узла cur до элемента els.lastP.
		 * @param {Node} cur Узел, с которого начинается поиск параграфов в тексте.
		 * @param {Object} nodes
		 * @param {Object} els
		 * @param {FBEditor.editor.element.AbstractElement} els.common Общий родительский элемент выделения.
		 * @param {FBEditor.editor.element.AbstractElement} els.lastP Последний параграф,
		 * перед которым поиск должен завершиться.
         * @return {Array} Список абзацев (p/li/subtitle).
		 */
		getNodesPP: function (cur, nodes, els)
		{
			var me = this,
				pp = [],
				p = [];

			//console.log('cur', cur);

			if (!cur)
			{
				return pp;
			}

			els.cur = cur.getElement();

			if (els.cur.equal(els.lastP))
			{
				// сигнал остановить рекурсию
				nodes.ppStop = true;

				return pp;
			}

			if (!els.cur.isStyleHolder)
			{
				// если элемент не параграф, ищем в нем все вложенные параграфы

				nodes.first = cur.firstChild;
				els.first = nodes.first ? nodes.first.getElement() : null;

				if (els.first && !els.first.isText)
				{
					//console.log('first');
					p = me.getNodesPP(nodes.first, nodes, els);
					Ext.Array.push(pp, p);
				}
			}
			else
			{
				pp = [cur];
			}

			if (cur.nextSibling && !nodes.ppStop)
			{
				// ищем в следующем элементе
				cur = cur.nextSibling;
				//console.log('next');
				p = me.getNodesPP(cur, nodes, els);
				Ext.Array.push(pp, p);
			}

			if (!nodes.ppStop)
			{
				// ищем в следующем по отношению к родительскому

				nodes.parent = cur.parentNode;
				els.parent = nodes.parent.getElement();

				while (!nodes.parent.nextSibling && !els.parent.equal(els.common))
				{
					nodes.parent = nodes.parent.parentNode;
					els.parent = nodes.parent.getElement();
				}

				nodes.parentNext = nodes.parent.nextSibling;

				if (nodes.parentNext && !els.parent.equal(els.common))
				{
					//console.log('parent next');
					p = me.getNodesPP(nodes.parentNext, nodes, els);
					Ext.Array.push(pp, p);
				}
			}

			return pp;
		},

		/**
		 * Возвращает самый вложенный первый дочерний узел.
		 * @param {Node} node Узел.
		 * @return {Node}
		 */
		getDeepFirst: function (node)
		{
			if (node)
			{
				while (node.firstChild)
				{
					node = node.firstChild;
				}
			}

			return node;
		},

		/**
		 * Возвращает самый вложенный последний дочерний узел.
		 * @param {Node} node Узел.
		 * @return {Node}
		 */
		getDeepLast: function (node)
		{
			if (node)
			{
				while (node.lastChild)
				{
					node = node.lastChild;
				}
			}

			return node;
		},

		/**
		 * Возвращает координаты символа, на котором установлен текстовый курсор, относительно окна браузера.
		 * @param {Boolean} [end] Искать ли позицию курсора для конечной точки выделения, иначе - для начальной.
		 * @return {Object}
		 * @return {Number} Object.x
		 * @return {Number} Object.y
		 */
		getCursorPosition: function (end)
		{
			var me = this,
				sel = window.getSelection(),
				els = {},
				nodes = {},
				cursor,
				pos,
				range,
				saveCursor,
				helper,
				viewportId;

			range = sel.getRangeAt(0);
			viewportId = range.startContainer.viewportId;
			saveCursor = {
				withoutSyncButtons: true,
				startNode: range.startContainer,
				startOffset: range.startOffset,
				endNode: range.endContainer,
				endOffset: range.endOffset
			};

			// запомниаем поизицию курсора относительно, которой ищутся координаты
			if (!end)
			{
				cursor = {
					node: range.startContainer,
					offset: range.startOffset
				};
			}
			else
			{
				nodes.cursor = range.endContainer;
				els.cursor = nodes.cursor.getElement();

				if (!els.cursor.isText)
				{
					// корректируем конечную точку выделения
					els.cursor = els.cursor.getDeepFirst();
					helper = els.cursor.getNodeHelper();
					nodes.cursor = helper.getNode(viewportId);
				}

				cursor = {
					node: nodes.cursor,
					offset: range.endOffset
				};
			}

			nodes.node = cursor.node;
			els.node = nodes.node.getElement();

			// получаем координаты символа, находящегося внутри элемента
			helper = els.node.getNodeHelper();
			pos = helper.getXY(viewportId, cursor.offset);

			// поскольку получение координат приводит к сбросу текущей позиции курсора, необходимо восстановить её
			me.setCursor(saveCursor);

			return pos;
		},

		/**
		 * Создает элемент из узла.
		 * @param {Node} node Узел.
		 * @return {FBEditor.editor.element.AbstractElement} Элемент.
		 */
		createElementFromNode: function (node)
		{
			var me = this,
				factory = me.getFactory(),
				attributes = {},
				name = node.nodeName.toLowerCase(),
				schema = me.getSchema(),
				val,
				el;

			if (node.nodeType === Node.TEXT_NODE)
			{
				val = node.nodeValue.trim();

				// для текстовых узлов игнорируем переносы и пустой текст
				if (val && !/^\n+$/.test(val))
				{
					el = factory.createElementText(node.nodeValue);
				}
			}
			else
			{
				// аттрибуты
				if (schema.elements[name])
				{
					Ext.Array.each(
						node.attributes,
						function (item)
						{
							// соответствует ли аттрибут схеме
							if (Ext.isObject(schema.elements[name].attributes[item.name]) ||
							Ext.Array.contains(['href'], item.name) && schema.elements[name].attributes['xlink:href'])
							{
								attributes[item.name] = item.value;
							}
						}
					);
				}

				//name = name === 'body' ? 'paste' : name;
				el = factory.createElement(name, attributes);

				Ext.Array.each(
					node.childNodes,
					function (child)
					{
						var childEl;

						childEl = me.createElementFromNode(child);

						if (childEl)
						{
							el.add(childEl);
						}
					}
				);
			}

			return el;
		},

		/**
		 * Удаляет все пустые дочерние узлы.
		 * @param {Node} node Узел.
		 */
		removeEmptyNodes: function (node)
		{
			var me = this,
				pos = 0,
				el,
				child;

			el = node.getElement();
			while (pos < el.children.length)
			{
				child = el.children[pos];

				if (child.isEmpty())
				{
					el.remove(child);
					node.removeChild(child.nodes[node.viewportId]);
				}
				else
				{
					if (child.children.length)
					{
						me.removeEmptyNodes(child.nodes[node.viewportId]);
					}
					pos++;
				}
			}
		},

		/**
		 * Прокручивает окно вниз на несколько строк, если курсора не видно.
		 */
		scrollViewDown: function ()
		{
			var me = this,
				editor = me.getEditor(),
				root = me.getContent(),
				helper,
				posCur,
				posEditor,
				heightEditor;

			posCur = me.getCursorPosition(true);
			posEditor = editor.getPosition();
			heightEditor = editor.getHeight();

			if (posCur.y + posCur.h > posEditor[1] + heightEditor)
			{
				// прокручиваем
				helper = root.getNodeHelper();
				helper.scrollBy(0, posCur.h * 3);
			}
		},

		/**
		 * Прокручивает окно вверх на несколько строк, если курсора не видно.
		 */
		scrollViewUp: function ()
		{
			var me = this,
				editor = me.getEditor(),
				root = me.getContent(),
				helper,
				posCur,
				posEditor;

			posCur = me.getCursorPosition();
			posEditor = editor.getPosition();

			if (posCur.y < posEditor[1])
			{
				// прокручиваем
				helper = root.getNodeHelper();
				helper.scrollBy(0, -posCur.h * 2);
			}
		},
		
		/**
		 * Добавляет оверлей в текст.
		 * @param {FBEditor.editor.overlay.Overlay} overlay Оверлей.
		 */
		addOverlay: function (overlay)
		{
			var me = this,
				cls = overlay.getCls(),
				overlays = me.overlays,
				data;
			
			overlays = overlays || [];
			overlays.push(overlay);
			me.overlays = overlays;
			
			// получаем данные подсветки
			data = overlay.getData();
			
			Ext.each(
				data,
				function (item)
				{
					var el = item.getEl(),
						pos = item.getPos();
					
					if (el.isText)
					{
						// создаем подсветку в текстовом элементе
						el.addOverlay(pos, cls);
					}
				}
			);
		},
		
		/**
		 * Удаляет оверлей в тексте.
		 * @param {FBEditor.editor.overlay.Overlay} overlay Оверлей.
		 */
		removeOverlay: function (overlay)
		{
			var me = this,
				cls = overlay.getCls(),
				data;
			
			// получаем данные подсветки
			data = overlay.getData();
			
			Ext.each(
				data,
				function (item)
				{
					var el = item.getEl();
					
					if (el.isText)
					{
						// создаем подсветку в текстовом элементе
						el.removeOverlay(cls);
					}
				}
			);
			
			// удаляем оверлей из кэша
			Ext.each(
				me.overlays,
				function (item, i)
				{
					if (item.getCls() === cls)
					{
						me.overlays.splice(i, 1);
					}
				}
			);
		},
		
		/**
		 * Удаляет все оверлеи в тексте.
		 */
		removeAllOverlays: function ()
		{
			var me = this,
				restoreSelection = me.overlays ? me.overlays.length : false;
			
			while (me.overlays && me.overlays.length)
			{
				me.removeOverlay(me.overlays[0]);
			}
			
			if (restoreSelection)
			{
				// восстанавливаем выделение
				me.restoreSelection();
			}
		},
		
		/**
		 * Обновляет порядковые номера всех элементов.
		 */
		updateNumbers: function ()
		{
			var me = this,
				root = me.getContent(),
				number = 0;
			
			root.setNumber(number);
			
			root.eachAll(
				function (el)
				{
					//console.log(number, el);
					number++;
					el.setNumber(number);
				}
			);
		}
	}
);