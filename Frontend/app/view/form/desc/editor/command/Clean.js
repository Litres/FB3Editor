/**
 * Команда уборки в поле текстового редактора.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.view.form.desc.editor.command.Clean',
	{
		extend: 'FBEditor.editor.command.AbstractCommand',

		/**
		 * @private
		 * @property {Number} Минимальная длина строки, менее которой должно происходить объединение.
		 */
		minLength: 50,

		execute: function ()
		{
			var me = this,
				data = me.getData(),
				res = false,
				descManager = FBEditor.desc.Manager,
				reg = descManager.getRegexpUtf(),
				root,
				manager,
				history;

			manager = data.manager;
			history = manager.getHistory();
			manager.setSuspendEvent(true);

			try
			{
				// корневой элемент
				root = manager.getContent();

				// перебираем всех потомков
				me.each(
					root,
					function (el)
					{
						var nodes = {},
							els = {},
							text,
							newText,
							node;

						if (el)
						{
							node = el.getNodeHelper().getNode();
							text = el.getText();

							//console.log('node', node, text, el);

							if (el.isText)
							{
								// удаляем неразрешенные символы

								newText = text.replace(reg, '');

								if (newText !== text)
								{
									text = newText;
									el.setText(newText);
									node.nodeValue = newText;
								}
							}

							if (el.isP)
							{
								nodes.next = node.nextSibling;
								els.next = nodes.next ? nodes.next.getElement() : null;

								// объединяем строку со следующей в случае:
								// 1) строка заканчивается на тире
								// 2) длина строки менее минимального лимита символов
								// 3) заканчиваетя не на знак припенания
								if ((/-$/.test(text) || text.length < me.minLength || /[^.,!?]+$/ig.test(text))
								    && els.next && !els.next.isEmpty())
								{
									// самый вложенный последний элемент текущей строки
									nodes.deepLast = manager.getDeepLast(node);
									els.deepLast = nodes.deepLast.getElement();
									els.lastText = els.deepLast.getText();

									// самый вложенный первый элемент следующей строки
									nodes.deepFirst = manager.getDeepFirst(nodes.next);
									els.deepFirst = nodes.deepFirst.getElement();
									els.firstText = els.deepFirst.getText();

									if (/-$/.test(els.lastText))
									{
										// удаляем тире в конце строки
										els.lastText = els.lastText.replace(/(-)+$/g, '');
										els.deepLast.setText(els.lastText);
										nodes.deepLast.nodeValue = els.lastText;
									}
									else if (!/ $/.test(els.lastText) && !/^ /.test(els.firstText))
									{
										// добавляем пробел между соединяемыми строками, если он отсутствует
										els.lastText = els.lastText + ' ';
										els.deepLast.setText(els.lastText);
										nodes.deepLast.nodeValue = els.lastText;
									}

									manager.joinNode(nodes.next);
								}
							}
						}
					}
				);

				res = true;
			}
			catch (e)
			{
				Ext.log({level: 'warn', msg: e, dump: e});
				history.removeNext();
			}

			manager.setSuspendEvent(false);

			return res;
		},

		unExecute: function ()
		{
			return true;
		},

		/**
		 * @private
		 * Перебирает всех потомков переданного элемента и вызывает на каждом переданную функцию.
		 * @param {FBEditor.editor.element.AbstractElement} el Элемент.
		 * @param {Function} fn Функция.
		 */
		each: function (el, fn)
		{
			var me = this;

			if (el)
			{
				el.each(
					function (child)
					{
						fn(child);
						me.each(child, fn);
					}
				);
			}
		}
	}
);