/**
 * Привязка клавиатурных сочетаний.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
	'FBEditor.editor.KeyMap',
	{
		/**
		 * @property {Array} Карта соответствия клавиш.
		 */
		map: [
			{
				key: 'B',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'strong'
				}
			},
			{
				key: 'D',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'div'
				}
			},
			{
				key: 'E',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'epigraph'
				}
			},
			{
				key: 'H',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'title'
				}
			},
			{
				key: 'I',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'em'
				}
			},
			{
				key: 'I',
				ctrl: true,
				shift: true,
				fn: 'onBtn',
				args: {
					name: 'spacing'
				}
			},
			{
				key: 'L',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'a'
				}
			},
			{
				key: 'M',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'pre'
				}
			},
			{
				key: 'N',
				ctrl: true,
				alt: true,
				fn: 'onBtn',
				args: {
					name: 'note'
				}
			},
			{
				key: 'P',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'img'
				}
			},
			{
				key: 'Q',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'blockquote'
				}
			},
			{
				key: 'S',
				ctrl: true,
				shift: true,
				fn: 'onBtn',
				args: {
					name: 'section'
				}
			},
			{
				key: 'FIVE',
				alt: true,
				shift: true,
				fn: 'onBtn',
				args: {
					name: 'strikethrough'
				}
			},
			{
				key: 'U',
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'underline'
				}
			},
			{
				keyCode: 188,
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'sub'
				}
			},
			{
				keyCode: 190,
				ctrl: true,
				fn: 'onBtn',
				args: {
					name: 'sup'
				}
			}
		],

		/**
		 * @private
		 * @property {FBEditor.editor.Manager} Менеджер редактора.
		 */
		manager: null,

		constructor: function (manager)
		{
			var me = this;

			this.manager = manager;
		},

		/**
		 * Нажатие клавиши.
		 * @param {Event} e Объект события.
		 */
		key: function (e)
		{
			var me = this,
				map = me.map;

			//console.log(e);

			Ext.Array.each(
				map,
			    function (cfg)
			    {
				    if (e.keyCode === Ext.event.Event[cfg.key] || e.keyCode === cfg.keyCode)
				    {
					    me.executeFn(e, cfg);
				    }
			    }
			);
		},

		/**
		 * @private
		 * Проверяет конфиг и выполняет функцию.
		 * @param {Event} e Объект события.
		 * @param {Object} cfg Конфиг клавиши.
		 */
		executeFn: function (e, cfg)
		{
			var me = this,
				args;

			if (e.ctrlKey && cfg.ctrl && !e.shiftKey && !cfg.shift && !e.altKey && !cfg.alt ||
			    e.shiftKey && cfg.shift && !e.ctrlKey && !cfg.ctrl && !e.altKey && !cfg.alt ||
			    e.shiftKey && cfg.shift && e.ctrlKey && cfg.ctrl && !e.altKey && !cfg.alt ||
			    e.shiftKey && cfg.shift && e.altKey && cfg.alt && !e.ctrlKey && !cfg.ctrl ||
			    !e.ctrlKey && !cfg.ctrl && !e.shiftKey && !cfg.shift && !e.altKey && !cfg.alt)
			{
				// выполяняем функцию
				if (cfg.fn && me[cfg.fn])
				{
					e.preventDefault();

					args = cfg.args || {};
					args.e = e;
					me[cfg.fn](args);
				}
			}
		},

		/**
		 * @private
		 * Выполняет нажатие кнопки на панели форматирования.
		 * @param args
		 * @param {String} args.name Имя кнопки.
		 */
		onBtn: function (args)
		{
			var me = this,
				manager = me.manager,
				name = args.name,
				editor,
				toolbar,
				btn;

			editor = manager.getEditor();
			toolbar = editor.getToolbar();
			btn = toolbar.getButton(name);

			//console.log(name, toolbar, btn);

			if (btn && !btn.disabled)
			{
				if (btn.enableToggle)
				{
					btn.toggle();
				}

				btn.fireEvent('click');
			}
		}
	}
);