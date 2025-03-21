import { z } from "zod";

const isValidTime = (time) => /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time);

const operationHourSchema = z.object({
  day: z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
  open: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format'),
  close: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format')
});

const addressSchema = z.object({
  street: z.string().min(3, 'Street address must be at least 3 characters'),
  city: z.string().min(2, 'City must be at least 2 characters'),
  state: z.string().min(2, 'State must be at least 2 characters'),
  zip: z.string().regex(/^\d{6}$/, 'ZIP code must be 6 digits'),
  country: z.string().default('India')
});

const gymSchema = z.object({
  name: z.string().min(3, 'Gym name must be at least 3 characters'),
  owner: z.string().min(1, 'Owner ID is required'),
  address: addressSchema,
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  operation_hours: z.array(
    z.object({
      day: z.string(),
      open: z.string(),
      close: z.string(),
    })
  )
    .min(1, 'At least one operation hour is required')
    .refine(hours => {
      const days = hours.map(h => h.day);
      return new Set(days).size === days.length;
    }, 'Duplicate days are not allowed'),
  facilities: z.array(z.string()).min(1, 'At least one facility is required'),
  membership_charges: z.object({
    monthly: z.number().min(0, 'Monthly charges cannot be negative'),
    half_yearly: z.number().min(0, 'Half Yearly charges cannot be negative'),
    yearly: z.number().min(0, 'Yearly charges cannot be negative'),
  }),
  description: z.string().min(20, 'Description must be at least 20 characters').optional(),
});

export const validateGym = async (req, res, next) => {
  try {
    req.body = {
      ...req.body,
      address: JSON.parse(req.body.address),
      operation_hours: JSON.parse(req.body.operation_hours),
      facilities: JSON.parse(req.body.facilities),
      membership_charges: JSON.parse(req.body.membership_charges)
    };

    const validatedData = await gymSchema.parseAsync(req.body);
    req.validatedGym = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }
    next(error);
  }
};


export const validateGymUpdate = async (req, res, next) => {
  try {
    const updateSchema = gymSchema.partial();
    const validatedData = await updateSchema.parseAsync(req.body);
    req.validatedGym = validatedData;
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Validation failed',
        errors: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

