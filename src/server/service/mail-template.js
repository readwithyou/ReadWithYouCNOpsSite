module.exports = {
    newRegistrationMail: '<div style="font-family:Microsoft Yahei;">Hi, OPS Team！<br/><br/>' +
        '系统收到了新的试课申请，学员姓名为%s。请及时登录OPS站点处理！<br/><br/>' +
        '谢谢!<br/><br/>' +
        '陪你读书工作室<br/>' +
        '</div>',

    childSchedulingEmail: '<div style="font-family:Microsoft Yahei;">%s 的家长，您好！<br/><br/>' +
        '陪你读书工作室很荣幸地能为%s的英语学习尽一份心力，培养英语阅读的好习惯，树立听说及英文使用的信心。<br/><br/>' +
        '试课时间我们安排在%s。请在预定上课时间前的10分钟点击以下链接进入教室:<br/><br/>' +
        '<h href="https://readwithyou.zoom.us/my/%s">https://readwithyou.zoom.us/my/%s</h><br/><br/>' +
        '我们建议用笔记本电脑上课。当您点击链接时电脑会自动做一次性的软件下载与安装（约5-10分钟）测试您的电脑摄像头，麦克风，扬声器和网络。<br/><br/>' +
        '若用iPad上课，请在AppStore中下载zoom, 教室ID为 <b style="color:red;">%s</b><br/><br/>' +
        '感谢您对工作室的信任。如您对试课有任何问题，请随时联系我们。<br/><br/>' +
        '谢谢!<br/><br/>' +
        '陪你读书工作室<br/>' +
        '<img src="cid:unique@kreata.ee"/></div>',

    adultSchedulingEmail: '<div style="font-family:Microsoft Yahei;">%s，您好！<br/><br/>' +
        '陪你读书工作室很荣幸地能为您的英语学习尽一份心力，培养英语阅读的好习惯，树立听说及英文使用的信心。<br/><br/>' +
        '试课时间我们安排在%s。请在预定上课时间前的10分钟点击以下链接进入教室:<br/><br/>' +
        '<h href="https://readwithyou.zoom.us/my/%s">https://readwithyou.zoom.us/my/%s</h><br/><br/>' +
        '我们建议用笔记本电脑上课。当您点击链接时电脑会自动做一次性的软件下载与安装（约5-10分钟）测试您的电脑摄像头，麦克风，扬声器和网络。<br/><br/>' +
        '若用iPad上课，请在AppStore中下载zoom, 教室ID为 <b style="color:red;">%s</b><br/><br/>' +
        '感谢您对工作室的信任。如您对试课有任何问题，请随时联系我们。<br/><br/>' +
        '谢谢!<br/><br/>' +
        '陪你读书工作室<br/>' +
        '<img src="cid:unique@kreata.ee"/></div>',

    teacherSchedulingEmail: '<div style="font-family:Calibri (Body);">%s,<br/><br/>' +
        'Here comes a trial request. Please prepare according to information below from student.<br/><br/>' +
        '1. Name: %s<br/><br/>' +
        '2. Age: %s<br/><br/>' +
        '2. Gender: %s<br/><br/>' +
        '3. Comments: %s<br/><br/>' +
        'The current book sample that he/she is reading can be found in the attachment (if any).<br/><br/>' +
        'The trial lesson is arranged at <b style="color:red;">%s</b>, room link is<br/><br/>' +
        '<h href="https://readwithyou.zoom.us/my/%s">https://readwithyou.zoom.us/my/%s</h><br/><br/>' +
        'Please login before 1-2min to wait the student for good experience. Thanks!<br/><br/>' +
        'OPS team<br/>' +
        '<img src="cid:unique@kreata.ee"/></div>',

    studentReportEmail: '<div style="font-family:Microsoft Yahei;">%s，您好！<br/><br/>' +
        '请于附件查收试课报告。<br/><br/>' +
        '感谢您对工作室的信任。如您对试课有任何问题，请随时联系我们。<br/><br/>' +
        '谢谢!<br/><br/>' +
        '陪你读书工作室<br/>' +
        '<img src="cid:unique@kreata.ee"/></div>',

    teacherReportEmail: '<div style="font-family:Calibri (Body);">%s,<br/><br/>' +
        'Please get the feedback about course report file for %s\'s trail lesson.<br/><br/>' +
        '%s<br/><br/>' +
        'Please help modify the report so we can forward to the student. Thanks!<br/><br/>' +
        'OPS team<br/>' +
        '<img src="cid:unique@kreata.ee"/></div>',

    teacherLeaveEmail: '<div style="font-family:Calibri (Body);">%s,<br/><br/>' +
        '%s will cancel the lesson %s. FYI.<br/><br/>' +
        'Have a nice day. Thanks!<br/><br/>' +
        'OPS team<br/>' +
        '<img src="cid:unique@kreata.ee"/></div>',

    newTicketEmailTitle: 'Ticket %s - New - Status %s - %s',
    newTicketEmailContent: '<div style="font-family:Calibri (Body);">' +
        'Ticket %s has been assigned to %s by %s.<br/><br/>' +
        'Detailed ticket information on the OPS Site:<br/>' +
        'https://ops.readwithyou.cn/#/tickets/%s<br/><br/>' +
        'Ticket Information<br/>' +
        'Short Description: %s<br/><br/>' +
        'Details:' +
        '%s<br/><br/>' +
        'OPS team<br/>',

    contentUpdateTicketEmailTitle: 'Ticket %s - Update - Status %s - %s',
    contentUpdateTicketEmailContent: '<div style="font-family:Calibri (Body);">' +
        'Ticket %s has been updated by %s.<br/><br/>' +
        'Detailed ticket information on the OPS Site:<br/>' +
        'https://ops.readwithyou.cn/#/tickets/%s<br/><br/>' +
        'Ticket Information<br/>' +
        'Short Description: %s<br/><br/>' +
        'Details:' +
        '%s<br/><br/>' +
        'OPS team<br/>',

    statusUpdateTicketEmailTitle: 'Ticket %s - Status Update - From %s To %s - %s',
    statusUpdateTicketEmailContent: '<div style="font-family:Calibri (Body);">' +
        'Ticket %s status has been changed from %s to %s by %s.<br/><br/>' +
        'Detailed ticket information on the OPS Site:<br/>' +
        'https://ops.readwithyou.cn/#/tickets/%s<br/><br/>' +
        'Ticket Information<br/>' +
        'Short Description: %s<br/><br/>' +
        'Details:' +
        '%s<br/><br/>' +
        'OPS team<br/>',

    assignmentUpdateTicketEmailTitle: 'Ticket %s - Reassign To %s - %s',
    assignmentUpdateTicketEmailContent: '<div style="font-family:Calibri (Body);">' +
        'Ticket %s has been re-assigned to %s by %s.<br/><br/>' +
        'Detailed ticket information on the OPS Site:<br/>' +
        'https://ops.readwithyou.cn/#/tickets/%s<br/><br/>' +
        'Ticket Information<br/>' +
        'Short Description: %s<br/><br/>' +
        'Details:' +
        '%s<br/><br/>' +
        'OPS team<br/>',

    ticketCorrespondenceEmailTitle: 'Ticket %s - Correspondence - Status %s - %s',
    ticketCorrespondenceEmailContent: '<div style="font-family:Calibri (Body);">' +
        'Correspondence from %s:<br/>' +
        '%s<br/><br/>' +
        'Detailed ticket information on the OPS Site:<br/>' +
        'https://ops.readwithyou.cn/#/tickets/%s<br/><br/>' +
        'Ticket Information<br/>' +
        'Short Description: %s<br/><br/>' +
        'Details:' +
        '%s<br/><br/>' +
        'OPS team<br/>',

    encodedSignatureImg: 'data:image/png;base64,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'
};