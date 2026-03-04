import { Router } from 'express';
import users from './users';
import events from './events';
import enrollments from './enrollments';

const router = Router();

router.use('/users', users);
router.use('/events', events);
router.use('/enrollments', enrollments);

export default router;
