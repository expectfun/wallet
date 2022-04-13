import { LocalizationSchema, PrepareSchema } from "./schema";

const schema: PrepareSchema<LocalizationSchema, '_0' | '_1' | '_2'> = {
    lang: 'ru',
    common: {
        and: 'и',
        accept: 'Принимаю',
        start: 'Начать',
        continue: 'Продолжить',
        continueAnyway: 'Продолжить все равно',
        back: 'Назад',
        logout: 'Выйти',
        cancel: 'Отменить',
        balance: 'Баланс',
        walletAddress: 'Адрес кошелька',
        copy: 'Скопировать',
        copied: 'Скопировано в буфер обмена',
        share: 'Поделиться',
        send: 'Отправить',
        yes: 'Да',
        no: 'Нет',
        amount: 'Количество',
        today: 'Сегодня',
        yesterday: 'Вчера',
        comment: 'Комментарий',
        products: 'Продукты',
        confirm: 'Подтвердить',
        soon: 'скоро',
        in: 'через'
    },
    home: {
        wallet: 'Кошелек',
        settings: 'Настройки'
    },
    settings: {
        title: 'Настройки',
        backupKeys: 'Сохранить секретные ключи',
        migrateOldWallets: 'Перенос старых кошельков',
        termsOfService: 'Условия использования',
        privacyPolicy: 'Политика конфиденциальности',
        developerTools: 'Инструменты разработчика'
    },
    wallet: {
        sync: 'Синхронизация кошелька',
        balanceTitle: 'Баланс Ton',
        actions: {
            receive: 'получить',
            send: 'отправить'
        },
        empty: {
            message: 'У вас нет транзакций',
            receive: 'Получить TON'
        }
    },
    receive: {
        title: 'Получить Ton',
        subtitle: 'Поделитесь данной ссылкой, чтобы получить Ton',
        share: {
            title: 'My Tonhub Address'
        }
    },
    transfer: {
        title: 'Отправить Ton',
        titleAction: 'Действие',
        confirm: 'Вы уверены что хотите продолжить?',
        error: {
            invalidAddress: 'Неверный адрес',
            invalidAmount: 'Неверное количество',
            sendingToYourself: 'Вы не можете отправлять монеты сами себе',
            zeroCoins: 'К сожалению, вы не можете отправить ноль монет',
            notEnoughCoins: 'К сожалению, на кошельке не достаточно монет для совершения транзакции',
            addressIsForTestnet: 'Этот адрес для тестовой сети',
            addressCantReceive: 'Этот адрес не может принимать монеты',
            addressIsNotActive: 'Этот адрес не активен'
        },
        sendAll: 'отправить все',
        scanQR: 'считать QR код',
        sendTo: 'Получатель',
        fee: 'Комиссия сети: {{fee}}',
        purpose: 'Цель транзакции',
        comment: 'Необязательное сообщение',
        commentReuiered: 'Обязательный комментарий',
        commentLabel: 'Сообщение',
        checkComment: 'Проверьте перед отправкой'
    },
    auth: {
        title: 'Авторизация',
        message: 'Разрешите <strong>{{name}}</strong> знать ваш адрес кошелька',
        hint: 'Никакие средства не будут переведены и сайт не сможет получить доступ к вашим монетам',
        action: 'Разрешить',
        expired: 'Этот запрос на авторизацию уже истек',
        completed: 'Этот запрос на авторизацию уже подтвержден',
        noApps: 'Нет связанных приложений',
        name: 'Приложения',
        revoke: {
            title: 'Вы уверены что хотите удалить это приложение?',
            message: 'Это удалит связь между кошельком и приложением, но вы всегда сможете восстановить эту связь обратно.',
            action: 'Удалить'
        }
    },
    migrate: {
        title: 'Перенос старых кошельков',
        subtitle: 'Если вы пользовались устаревшими кошельками вы можете автоматически перевести все ваши средства со старых адресов.',
        inProgress: 'Перенос старых кошельков...',
        transfer: 'Переводим монеты с адреса {{address}}',
        check: 'Проверяем адрес {{address}}'
    },
    tx: {
        sending: 'Отправка #{{id}}',
        sent: 'Отправлено #{{id}}',
        received: 'Получено'
    },
    txPreview: {
        sendAgain: 'повторить',
        blockchainFee: 'Комиссия сети'
    },
    qr: {
        title: 'Отсканируйте QR-код',
        requestingPermission: 'Запрашиваем доступ к камере...',
        noPermission: 'Нет доступа к камере'
    },
    products: {
        oldWallets: {
            title: 'Старые кошельки',
            subtitle: 'Нажмите, чтобы перенести кошельки'
        },
        transactionRequest: 'Запрос транзакции',
        staking: {
            title: 'Стейкинг',
            balance: 'Баланс стейкинга',
            subtitle: {
                join: 'Зарабатывайте на TON до 13,3%',
                joined: 'Зарабатывайте на TON',
                rewards: 'Расчетная доходность',
                apy: '~13.3% годовых от вклада'
            },
            transfer: {
                stakingWarning: 'Вы всегда можете внести новую ставку или увеличить существующую на любую сумму. Обратите внимание, что минимальная сумма составляет: {{minAmount}}',
                depositStakeTitle: 'Стейкинг',
                depositStakeConfirmTitle: 'Подтвердить стекинг',
                withdrawStakeTitle: 'Вывести со Стейкинга',
                withdrawStakeConfirmTitle: 'Подтвердить вывод',
                topUpTitle: 'Пополнить',
                topUpConfirmTitle: 'Подтвердить пополнение',
                notEnoughStaked: 'К сожалению, у вас недостаточно монет на стейке'
            },
            nextCycle: 'След. цикл',
            cycleNote: 'Все транзакции (вывод, пополнение стейкинга) исполняются только после завершения цикла',
            cycleNoteWithdraw: 'Транзакции по выводу исполняются только после завершения цикла',
            buttonTitle: 'cтейкинг',
            balanceTitle: 'Стейкинг Баланс',
            actions: {
                deposit: 'Внести',
                top_up: 'Пополнить',
                withdraw: 'Вывести'
            },
            join: {
                title: 'Стань валидатором TON',
                message: 'Стейкинг — это общественное благо для экосистемы TON. Вы можете помочь защитить сеть и получить вознаграждение в процессе',
                buttonTitle: 'Начать зарабатывать',
                moreAbout: 'Подробнее о Tonwhales Staking Pool',
                earn: 'Получайте до',
                onYourTons: 'дохода со стейкинга',
                apy: '13.3%',
                yearly: 'годовых',
                cycle: 'Вознаграждения за стейкинг приходят каждые 36ч',
                ownership: 'Застейканные монеты принадлежат только вам',
                withdraw: 'Выводите и пополняйте баланс стейкинга в любое время',
                successTitle: 'Отправлено {{amount}} TON',
                successEtimation: 'Ваш предполагаемый годовой доход составляет {{amount}}\u00A0TON\u00A0(${{price}}).',
                successNote: 'Ваш застейканый TON будет активен после начала следующего цикла.'
            },
            pool: {
                balance: 'Общая ставка',
                members: 'Номинаторы',
                profitability: 'Прибыльность'
            },
            empty: {
                message: 'У вас нет транзакций'
            },
            pending: {
                deposit: 'Выполняется внесение',
                withdraw: 'Ожидание вывода'
            },
            withdrawStatus: {
                pending: 'Вывод ожидает',
                ready: 'Готово к выводу',
                withdrawNow: 'Вывести сейчас'
            },
            depositStatus: {
                pending: 'Взнос ожидает'
            },
            withdraw: 'Вывод',
            sync: 'Синхронизация данных',
            unstake: {
                title: 'Вы уверены что хотите запросить вывод?',
                message: 'Обратите внимание, что при запросе на вывод все незавершенные депозиты также будут возвращены.'
            },
            learnMore: 'Инфо',
            moreInfo: 'Больше информации',
            calc: {
                yearly: 'Доходность в год',
                monthly: 'Доходность в месяц',
                daily: 'Доходность в день',
                note: 'Рассчитано с учетом всех комиссий',
                text: 'Калькулятор доходности',
                yearlyTopUp: 'После пополнения',
                yearlyTotal: 'Всего вознаграждений за год',
                yearlyCurrent: 'Текущая',
                topUpTitle: 'Ваша годовая доходность'
            },
            info: {
                rate: '~13.3%',
                rateTitle: 'Годовая доходность',
                frequency: 'Каждые 36ч',
                frequencyTitle: 'Частота выплат',
                minDeposit: 'Минимальный депозит',
                poolFee: '3.3%',
                poolFeeTitle: 'Комиссия пула',
                depositFee: 'Газ за отправку',
                withdrawFee: 'Комиссия за вывод',
                blockchainFee: 'Комиссия сети',
            },
            minAmountWarning: 'Минимальное количество {{minAmount}} TON',
            tryAgainLater: 'Пожалуйста, повторите попытку позже',
            banner: {
                estimatedEarnings: "Ваш предполагаемый годовой доход уменьшится на {{amount}}\u00A0TON\u00A0(${{price}})",
                message: "Уверены, что хотите вывести?"
            }
        },
    },
    welcome: {
        title: 'Tonhub',
        titleDev: 'Ton Development Wallet',
        subtitle: 'Простой и безопасный кошелек для TON',
        subtitleDev: 'Кошелек для разработчиков',
        createWallet: 'Создать кошелек',
        importWallet: 'Импортировать кошелек'
    },
    legal: {
        title: 'Правовая информация',
        subtitle: 'Пожалуйста, примите нашу',
        privacyPolicy: 'политику конфиденциальности',
        termsOfService: 'условия использования'
    },
    create: {
        inProgress: 'Создаем...'
    },
    import: {
        title: '24 Секретных слова',
        subtitle: 'Пожалуйста, восстановите доступ к вашему кошельку, введя 24 секретных слова, которые вы записали при создании кошелька.'
    },
    secure: {
        title: 'Защитите свой кошелек',
        titleUnprotected: 'Ваше устройство не защищено',
        subtitle: 'Мы используем биометрию для подтверждения транзакций что бы быть уверенными что никто кроме вас не сможет перевести ваши монеты.',
        subtitleUnprotected: 'Настоятельно рекомендуется включить пароль на вашем устройстве для защиты ваших активов.',
        subtitleNoBiometrics: 'Настоятельно рекомендуется включить биометрию на вашем устройстве для защиты ваших активов. Мы используем биометрию для подтверждения транзакций что бы быть уверенными что никто кроме вас не сможет перевести ваши монеты.',
        messageNoBiometrics: 'Настоятельно рекомендуется включить биометрию на вашем устройстве для защиты ваших активов.',
        protectFaceID: 'Защитить с Face ID',
        protectTouchID: 'Защитить с Touch ID',
        protectBiometrics: 'Защитить с биометрией',
        protectPasscode: 'Защитить паролем'
    },
    backup: {
        title: 'Фраза восстановления',
        subtitle: 'Запишите эти 24 слова в указанном ниже порядке и сохраните их в секретном, надежном месте.'
    },
    backupIntro: {
        title: 'Создайте резервную копию',
        subtitle: 'На следующем шаге вы увидите 24 секретных слова, позволяющих восстановить кошелек.',
        clause1: 'Если я потеряю фразу восстановления, мои средства будут потеряны навсегда.',
        clause2: 'Если я раскрою или передам кому-либо свою фразу восстановления, мои средства могут быть украдены.',
        clause3: 'Я несу полную ответственность за сохранность моей фразы восстановления.'
    },
    errors: {
        incorrectWords: {
            title: 'Неверная фраза',
            message: 'Вы ввели неправильные секретные слова. Пожалуйста, проверьте ввод и попробуйте еще раз.'
        },
        secureStorageError: {
            title: 'Ошибка безопасного хранилища',
            message: 'К сожалению, мы не можем сохранить данные. Пожалуйста, перезагрузите телефон.'
        }
    },
    confirm: {
        logout: {
            title: 'Вы уверены что хотите выйти?',
            message: 'Вы собираетесь отключить кошелек от этого приложения. Вы сможете восстановить свой кошелек, используя свои 24 секретных слова, или импортировать другой кошелек.'
        }
    }
};

export default schema;